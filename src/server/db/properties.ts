import db from "@/server/db";
import type { Property, PropertyImage, Amenity, HouseRule, Service, PropertyVerification } from "@/lib/types";

export interface PropertyWithJoins extends Property {
  images: PropertyImage[];
  amenities: (Amenity & { category: string })[];
  rules: HouseRule[];
  services: Service[];
  verification?: PropertyVerification | null;
  host_company?: string | null;
}

function basePropertySelect() {
  return `
    p.*,
    r.name AS region_name,
    r.slug AS region_slug,
    d.name AS destination_name,
    (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.property_id = p.id AND rv.approved = 1) AS average_rating,
    (SELECT COUNT(rv.id) FROM reviews rv WHERE rv.property_id = p.id AND rv.approved = 1) AS review_count
  `;
}

export function getPublishedProperties(params?: {
  collectionSlug?: string;
  regionSlug?: string;
  search?: string;
  minGuests?: number;
  minBedrooms?: number;
  maxPriceMinor?: number;
  amenities?: string[];
  beachfront?: boolean;
  oceanView?: boolean;
  jungleView?: boolean;
  pool?: boolean;
  limit?: number;
}): Property[] {
  const where: string[] = ["p.status = 'PUBLISHED'"];
  const args: any[] = [];

  if (params?.collectionSlug) {
    where.push("c.slug = ?");
    args.push(params.collectionSlug);
  }
  if (params?.regionSlug) {
    where.push("r.slug = ?");
    args.push(params.regionSlug);
  }
  if (params?.minGuests) {
    where.push("p.max_guests >= ?");
    args.push(params.minGuests);
  }
  if (params?.minBedrooms) {
    where.push("p.bedrooms >= ?");
    args.push(params.minBedrooms);
  }
  if (params?.maxPriceMinor) {
    where.push("p.base_price_minor <= ?");
    args.push(params.maxPriceMinor);
  }
  if (params?.beachfront) where.push("p.beachfront = 1");
  if (params?.oceanView) where.push("p.ocean_view = 1");
  if (params?.jungleView) where.push("p.jungle_view = 1");
  if (params?.pool) where.push("p.pool = 1");
  if (params?.search) {
    where.push("(p.name LIKE ? OR p.tagline LIKE ? OR p.description LIKE ? OR r.name LIKE ?)");
    const s = `%${params.search}%`;
    args.push(s, s, s, s);
  }

  let sql = `
    SELECT ${basePropertySelect()}
    FROM properties p
    LEFT JOIN regions r ON r.id = p.region_id
    LEFT JOIN destinations d ON d.id = p.destination_id
    LEFT JOIN collections c ON c.id = p.collection_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY p.featured DESC, p.name ASC
    ${params?.limit ? `LIMIT ${Number(params.limit)}` : ""}
  `;

  const rows = db.prepare(sql).all(...args) as Property[];

  if (params?.amenities && params.amenities.length > 0) {
    const placeholders = params.amenities.map(() => "?").join(",");
    const matching = db
      .prepare(
        `SELECT pa.property_id FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE a.slug IN (${placeholders}) GROUP BY pa.property_id HAVING COUNT(DISTINCT a.slug) = ?`,
      )
      .all(...params.amenities, params.amenities.length) as { property_id: string }[];
    const ids = new Set(matching.map((m) => m.property_id));
    return rows.filter((r) => ids.has(r.id));
  }
  return rows;
}

export function getPropertyBySlug(slug: string, opts?: { forEdit?: boolean }): PropertyWithJoins | null {
  const p = db
    .prepare(
      `SELECT ${basePropertySelect()} FROM properties p
       LEFT JOIN regions r ON r.id = p.region_id
       LEFT JOIN destinations d ON d.id = p.destination_id
       LEFT JOIN collections c ON c.id = p.collection_id
       LEFT JOIN host_profiles hp ON hp.id = p.host_id
       WHERE p.slug = ? ${opts?.forEdit ? "" : "AND p.status = 'PUBLISHED'"}`,
    )
    .get(slug) as any;
  if (!p) return null;
  p.host_company = p.host_company ?? null;
  const images = db
    .prepare(`SELECT * FROM property_images WHERE property_id = ? ORDER BY order_index ASC`)
    .all(p.id) as PropertyImage[];
  const amenities = db
    .prepare(
      `SELECT a.* FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = ? ORDER BY a.category, a.name`,
    )
    .all(p.id) as (Amenity & { category: string })[];
  const rules = db
    .prepare(`SELECT * FROM house_rules WHERE property_id = ? ORDER BY order_index ASC`)
    .all(p.id) as HouseRule[];
  const services = db
    .prepare(`SELECT * FROM services WHERE property_id = ? AND active = 1`)
    .all(p.id) as Service[];
  const verification = db
    .prepare(`SELECT * FROM property_verifications WHERE property_id = ?`)
    .get(p.id) as PropertyVerification | null;

  // Normalize null numeric aggregates
  p.average_rating = p.average_rating != null ? Number(p.average_rating) : null;
  p.review_count = p.review_count != null ? Number(p.review_count) : 0;

  return { ...p, images, amenities, rules, services, verification };
}

export function getPropertyById(id: string) {
  return db.prepare(`SELECT * FROM properties WHERE id = ?`).get(id) as Property | undefined;
}

export function getCollectionBySlug(slug: string) {
  return db.prepare(`SELECT * FROM collections WHERE slug = ?`).get(slug) as any;
}

export function getActiveCollections() {
  return db
    .prepare(
      `SELECT c.*, d.name AS destination_name, d.slug AS destination_slug,
        (SELECT COUNT(*) FROM properties p WHERE p.collection_id = c.id AND p.status = 'PUBLISHED') AS property_count
       FROM collections c
       JOIN destinations d ON d.id = c.destination_id
       WHERE c.coming_soon = 0
       ORDER BY c.is_active DESC, c.title ASC`,
    )
    .all() as any[];
}

export function getComingSoonCollections() {
  return db
    .prepare(
      `SELECT c.*, d.name AS destination_name, d.slug AS destination_slug
       FROM collections c
       JOIN destinations d ON d.id = c.destination_id
       WHERE c.coming_soon = 1
       ORDER BY c.title`,
    )
    .all() as any[];
}

export function getRegionsForDestination(destinationSlug: string) {
  return db
    .prepare(
      `SELECT r.*, (SELECT COUNT(*) FROM properties p WHERE p.region_id = r.id AND p.status='PUBLISHED') AS property_count
       FROM regions r JOIN destinations d ON d.id = r.destination_id
       WHERE d.slug = ?
       ORDER BY r.name`,
    )
    .all(destinationSlug) as any[];
}

export function getAmenityCategories() {
  const rows = db.prepare(`SELECT * FROM amenities ORDER BY category, name`).all() as (Amenity & { category: string })[];
  const groups: Record<string, (Amenity & { category: string })[]> = {};
  for (const a of rows) {
    groups[a.category] = groups[a.category] || [];
    groups[a.category].push(a);
  }
  return groups;
}

export function getReviewsForProperty(propertyId: string) {
  return db
    .prepare(
      `SELECT rv.*, u.first_name AS author_first_name, u.last_name AS author_last_name
       FROM reviews rv JOIN users u ON u.id = rv.user_id
       WHERE rv.property_id = ? AND rv.approved = 1
       ORDER BY rv.created_at DESC
       LIMIT 20`,
    )
    .all(propertyId) as any[];
}
