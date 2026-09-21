import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Database location. For production with Postgres, this module can be swapped
// for a thin pg adapter with the same query signatures.
const DB_DIR = path.join(process.cwd(), "prisma");
const DB_PATH = process.env.DATABASE_PATH || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:")
  ? path.join(DB_DIR, process.env.DATABASE_URL.replace("file:", ""))
  : path.join(DB_DIR, "dev.db"));

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __nx_db__: Database.Database | undefined;
}

export const db: Database.Database =
  global.__nx_db__ || new Database(DB_PATH, { verbose: undefined });

if (process.env.NODE_ENV !== "production") {
  global.__nx_db__ = db;
}

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------------------------------------------------------------------------
// Schema initialisation (idempotent). For production, use migrations.
// ---------------------------------------------------------------------------
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      iso_code TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      latitude REAL,
      longitude REAL,
      country_id TEXT NOT NULL REFERENCES countries(id)
    );

    CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
      UNIQUE(destination_id, slug)
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      subtitle TEXT,
      description TEXT,
      hero_image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 0,
      coming_soon INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      destination_id TEXT NOT NULL REFERENCES destinations(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT,
      last_name TEXT,
      avatar_url TEXT,
      password_hash TEXT,
      email_verified TEXT,
      phone TEXT,
      country TEXT,
      locale TEXT NOT NULL DEFAULT 'en',
      currency TEXT NOT NULL DEFAULT 'EUR',
      role TEXT NOT NULL DEFAULT 'TRAVELLER',
      suspended INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires TEXT NOT NULL,
      UNIQUE(identifier, token)
    );

    CREATE TABLE IF NOT EXISTS host_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      company_name TEXT,
      bio TEXT,
      verification_status TEXT NOT NULL DEFAULT 'unverified',
      verification_notes TEXT,
      verified_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tagline TEXT,
      description TEXT NOT NULL,
      overview TEXT,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      max_guests INTEGER NOT NULL,
      size_sqm INTEGER,
      latitude REAL,
      longitude REAL,
      address TEXT,
      hero_image_url TEXT,
      video_url TEXT,
      base_price_minor INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      cleaning_fee_minor INTEGER NOT NULL DEFAULT 0,
      service_fee_pct INTEGER NOT NULL DEFAULT 0,
      tax_pct INTEGER NOT NULL DEFAULT 0,
      security_deposit_minor INTEGER NOT NULL DEFAULT 0,
      min_stay_nights INTEGER NOT NULL DEFAULT 3,
      max_stay_nights INTEGER,
      check_in_time TEXT NOT NULL DEFAULT '15:00',
      check_out_time TEXT NOT NULL DEFAULT '11:00',
      booking_mode TEXT NOT NULL DEFAULT 'REQUEST',
      beachfront INTEGER NOT NULL DEFAULT 0,
      ocean_view INTEGER NOT NULL DEFAULT 0,
      jungle_view INTEGER NOT NULL DEFAULT 0,
      pool INTEGER NOT NULL DEFAULT 1,
      family_friendly INTEGER NOT NULL DEFAULT 0,
      events_allowed INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      featured INTEGER NOT NULL DEFAULT 0,
      verified_at TEXT,
      last_verified_at TEXT,
      cancellation_policy TEXT NOT NULL DEFAULT 'moderate',
      host_id TEXT NOT NULL REFERENCES host_profiles(id),
      collection_id TEXT REFERENCES collections(id),
      destination_id TEXT NOT NULL REFERENCES destinations(id),
      region_id TEXT REFERENCES regions(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS property_images (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      alt TEXT,
      caption TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS amenities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS property_amenities (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      amenity_id TEXT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
      UNIQUE(property_id, amenity_id)
    );

    CREATE TABLE IF NOT EXISTS house_rules (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS property_verifications (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
      host_identity INTEGER NOT NULL DEFAULT 0,
      property_reviewed INTEGER NOT NULL DEFAULT 0,
      listing_checked INTEGER NOT NULL DEFAULT 0,
      imagery_reviewed INTEGER NOT NULL DEFAULT 0,
      last_verified_at TEXT,
      reviewer_id TEXT,
      notes TEXT,
      expires_at TEXT
    );

    CREATE TABLE IF NOT EXISTS availability_blocks (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      note TEXT,
      booking_id TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      property_id TEXT NOT NULL REFERENCES properties(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER NOT NULL,
      nights INTEGER NOT NULL,
      nights_subtotal_minor INTEGER NOT NULL,
      cleaning_fee_minor INTEGER NOT NULL,
      service_fee_minor INTEGER NOT NULL DEFAULT 0,
      tax_minor INTEGER NOT NULL DEFAULT 0,
      discount_minor INTEGER NOT NULL DEFAULT 0,
      total_minor INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      status TEXT NOT NULL DEFAULT 'DRAFT',
      special_requests TEXT,
      instant_book INTEGER NOT NULL DEFAULT 0,
      cancellation_policy TEXT NOT NULL DEFAULT 'moderate',
      terms_accepted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS booking_status_history (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      from_status TEXT,
      to_status TEXT NOT NULL,
      note TEXT,
      actor_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cancellations (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id),
      reason TEXT NOT NULL,
      cancelled_by TEXT NOT NULL,
      refund_minor INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id),
      amount_minor INTEGER NOT NULL,
      currency TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'STRIPE',
      status TEXT NOT NULL DEFAULT 'PENDING',
      provider_session_id TEXT,
      provider_payment_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      payment_id TEXT NOT NULL REFERENCES payments(id),
      amount_minor INTEGER NOT NULL,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS platform_fee_config (
      id TEXT PRIMARY KEY,
      commission_pct INTEGER NOT NULL DEFAULT 2,
      currency TEXT NOT NULL DEFAULT 'EUR',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price_model TEXT NOT NULL DEFAULT 'FIXED',
      price_minor INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      active INTEGER NOT NULL DEFAULT 1,
      lead_time_hours INTEGER,
      capacity INTEGER,
      requires_confirmation INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS service_orders (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id),
      service_id TEXT NOT NULL REFERENCES services(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      price_minor INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested',
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, property_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id),
      property_id TEXT NOT NULL REFERENCES properties(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      title TEXT,
      body TEXT NOT NULL,
      host_reply TEXT,
      approved INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      subject TEXT,
      related_booking_id TEXT,
      related_property_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conversation_members (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      last_read_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(conversation_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL REFERENCES users(id),
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      read_at TEXT,
      link_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS concierge_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      property_id TEXT,
      check_in TEXT,
      check_out TEXT,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      contact_method TEXT NOT NULL DEFAULT 'email',
      occasion TEXT,
      urgency TEXT NOT NULL DEFAULT 'normal',
      status TEXT NOT NULL DEFAULT 'received',
      admin_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'normal',
      assignee_id TEXT,
      admin_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id),
      reporting_party_id TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      requested_resolution TEXT,
      status TEXT NOT NULL DEFAULT 'opened',
      admin_notes TEXT,
      decision TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dispute_evidence (
      id TEXT PRIMARY KEY,
      dispute_id TEXT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
      uploader_id TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS feature_flags (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      enabled INTEGER NOT NULL DEFAULT 0,
      config TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS platform_settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      metadata TEXT,
      ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      discount_pct INTEGER,
      discount_minor INTEGER,
      starts_at TEXT NOT NULL,
      expires_at TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- indexes
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    CREATE INDEX IF NOT EXISTS idx_properties_collection ON properties(collection_id);
    CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region_id);
    CREATE INDEX IF NOT EXISTS idx_properties_destination ON properties(destination_id);
    CREATE INDEX IF NOT EXISTS idx_properties_host ON properties(host_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_blocks_property ON availability_blocks(property_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
  `);
}

// Utility: convert snake_case rows to camelCase if needed in future.
initSchema();

export default db;
