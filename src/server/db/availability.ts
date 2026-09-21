import db from "@/server/db";
import { dateRangeOverlaps } from "@/lib/utils";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

/**
 * Returns true if the property is available across the given date range,
 * respecting min_stay_nights and existing blocks/bookings.
 */
export function isPropertyAvailable(propertyId: string, checkIn: string, checkOut: string, guests: number): { ok: boolean; reason?: string } {
  const prop = db
    .prepare(`SELECT * FROM properties WHERE id = ? AND status = 'PUBLISHED'`)
    .get(propertyId) as any;
  if (!prop) return { ok: false, reason: "Property not found" };
  if (guests > prop.max_guests) return { ok: false, reason: `Maximum ${prop.max_guests} guests` };

  const ci = new Date(checkIn + "T00:00:00Z");
  const co = new Date(checkOut + "T00:00:00Z");
  const nights = Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < prop.min_stay_nights) return { ok: false, reason: `Minimum stay ${prop.min_stay_nights} nights` };
  if (prop.max_stay_nights && nights > prop.max_stay_nights) return { ok: false, reason: `Maximum stay ${prop.max_stay_nights} nights` };
  if (nights <= 0) return { ok: false, reason: "Invalid dates" };

  const blocks = db
    .prepare(
      `SELECT start_date, end_date, reason FROM availability_blocks WHERE property_id = ?`,
    )
    .all(propertyId) as { start_date: string; end_date: string; reason: string }[];
  const booked = db
    .prepare(
      `SELECT check_in, check_out, status FROM bookings
       WHERE property_id = ? AND status IN ('CONFIRMED','CHECKED_IN','AWAITING_HOST','APPROVED','AWAITING_PAYMENT','PAYMENT_PROCESSING')`,
    )
    .all(propertyId) as { check_in: string; check_out: string; status: string }[];

  const ranges = [
    ...blocks.map((b) => ({ start: b.start_date.slice(0, 10), end: b.end_date.slice(0, 10), reason: b.reason })),
    ...booked.map((b) => ({ start: b.check_in.slice(0, 10), end: b.check_out.slice(0, 10), reason: "booking" })),
  ];
  for (const r of ranges) {
    if (dateRangeOverlaps(ci, co, new Date(r.start + "T00:00:00Z"), new Date(r.end + "T00:00:00Z"))) {
      return { ok: false, reason: "These dates are unavailable" };
    }
  }
  return { ok: true };
}

/** Return a list of date ranges that are blocked for the next N months. */
export function getUnavailableRanges(propertyId: string, monthsAhead = 12) {
  const out: { start: string; end: string; reason: string }[] = [];
  const blocks = db
    .prepare(
      `SELECT start_date, end_date, reason FROM availability_blocks
       WHERE property_id = ? AND start_date <= date('now', ?)`,
    )
    .all(propertyId, `+${monthsAhead} months`) as any[];
  for (const b of blocks) out.push({ start: b.start_date.slice(0, 10), end: b.end_date.slice(0, 10), reason: b.reason });
  const bookings = db
    .prepare(
      `SELECT check_in, check_out FROM bookings
       WHERE property_id = ?
       AND status IN ('CONFIRMED','CHECKED_IN','AWAITING_HOST','APPROVED','AWAITING_PAYMENT','PAYMENT_PROCESSING')
       AND check_in <= date('now', ?)`,
    )
    .all(propertyId, `+${monthsAhead} months`) as any[];
  for (const b of bookings) out.push({ start: b.check_in.slice(0, 10), end: b.check_out.slice(0, 10), reason: "booking" });
  return out;
}

/**
 * Create a temporary hold block during checkout (e.g. 15-minute hold).
 */
export function createHold(propertyId: string, checkIn: string, checkOut: string, bookingId: string, minutes = 30) {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  db.prepare(
    `INSERT INTO availability_blocks (id,property_id,start_date,end_date,reason,note,booking_id)
     VALUES (?,?,?,?,?,?,?)`,
  ).run(require("@/lib/utils").cuid(), propertyId, checkIn, checkOut, "hold", `expires=${expiresAt}`, bookingId);
}
