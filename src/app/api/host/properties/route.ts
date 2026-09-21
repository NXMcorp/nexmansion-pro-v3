import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid, slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(s.user.id) as any;
  if (!host) return NextResponse.json({ error: "Host profile required" }, { status: 403 });
  const body = await req.json().catch(()=>({}));
  const schema = z.object({
    name: z.string().min(3).max(200),
    tagline: z.string().max(200).optional(),
    description: z.string().min(20),
    bedrooms: z.coerce.number().int().min(1),
    bathrooms: z.coerce.number().int().min(1),
    maxGuests: z.coerce.number().int().min(1),
    basePriceMinor: z.coerce.number().int().positive(),
    region: z.string().optional(),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const bali = db.prepare(`SELECT id FROM destinations WHERE slug='bali'`).get() as any;
  let slug = slugify(parsed.data.name);
  let i = 1;
  while (db.prepare(`SELECT id FROM properties WHERE slug=?`).get(slug)) { slug = `${slugify(parsed.data.name)}-${i++}`; }
  const region = parsed.data.region
    ? (db.prepare(`SELECT id FROM regions WHERE slug=? AND destination_id=?`).get(parsed.data.region, bali.id) as any)
    : null;
  const id = cuid();
  db.prepare(`INSERT INTO properties (id,name,slug,tagline,description,bedrooms,bathrooms,max_guests,base_price_minor,currency,cleaning_fee_minor,tax_pct,host_id,destination_id,region_id,status,booking_mode,pool) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`)
    .run(id, parsed.data.name, slug, parsed.data.tagline || null, parsed.data.description, parsed.data.bedrooms,
      parsed.data.bathrooms, parsed.data.maxGuests, parsed.data.basePriceMinor, "EUR", 0, 10, host.id, bali.id, region?.id || null, "SUBMITTED", "REQUEST");
  return NextResponse.json({ ok: true, id, slug });
}
