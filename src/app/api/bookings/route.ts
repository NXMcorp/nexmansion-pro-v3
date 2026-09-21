import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { calculatePrice, serviceLinePrice } from "@/lib/money";
import { isPropertyAvailable } from "@/server/db/availability";
import { cuid, generateReference } from "@/lib/utils";

const schema = z.object({
  propertyId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().positive().max(30),
  serviceIds: z.array(z.string()).optional().default([]),
  specialRequests: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { propertyId, checkIn, checkOut, guests, serviceIds, specialRequests } = parsed.data;

  const prop = db.prepare(`SELECT * FROM properties WHERE id=? AND status='PUBLISHED'`).get(propertyId) as any;
  if (!prop) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const avail = isPropertyAvailable(propertyId, checkIn, checkOut, guests);
  if (!avail.ok) return NextResponse.json({ error: avail.reason }, { status: 409 });

  const ci = new Date(checkIn); const co = new Date(checkOut);
  const nights = Math.round((co.getTime() - ci.getTime()) / (1000*60*60*24));

  const commission = (db.prepare(`SELECT commission_pct FROM platform_fee_config WHERE active=1 ORDER BY created_at DESC LIMIT 1`).get() as any)?.commission_pct ?? 2;

  let servicesMinor = 0;
  const services: any[] = [];
  if (serviceIds.length) {
    const rows = db.prepare(`SELECT * FROM services WHERE id IN (${serviceIds.map(()=>"?").join(",")}) AND active=1`).all(...serviceIds) as any[];
    for (const s of rows) {
      const line = serviceLinePrice(s.price_minor, s.price_model, 1, guests, nights);
      services.push({ service: s, price: line });
      servicesMinor += line;
    }
  }

  const price = calculatePrice({
    nightlyRateMinor: prop.base_price_minor,
    nights,
    cleaningFeeMinor: prop.cleaning_fee_minor,
    serviceFeePct: prop.service_fee_pct,
    taxPct: prop.tax_pct,
    platformCommissionPct: commission,
    servicesMinor,
    securityDepositMinor: 0, // deposit not charged at booking in V1
    currency: prop.currency,
  });

  // Transaction to prevent double-booking
  const tx = db.transaction(() => {
    // Re-check availability with lock (in SQLite the write transaction serializes)
    const conflict = db.prepare(
      `SELECT id FROM bookings WHERE property_id=? AND status IN ('CONFIRMED','CHECKED_IN','AWAITING_HOST','APPROVED','AWAITING_PAYMENT','PAYMENT_PROCESSING')
       AND NOT (check_out <= ? OR check_in >= ?)`
    ).get(propertyId, checkIn, checkOut);
    if (conflict) throw new Error("Just booked — please try different dates");

    const bookingId = cuid();
    const ref = generateReference("NX");
    const initialStatus = prop.booking_mode === "INSTANT" ? "AWAITING_PAYMENT" : "AWAITING_HOST";
    db.prepare(
      `INSERT INTO bookings (id,reference,property_id,user_id,check_in,check_out,guests,nights,
        nights_subtotal_minor,cleaning_fee_minor,service_fee_minor,tax_minor,total_minor,currency,status,
        special_requests,instant_book,cancellation_policy,terms_accepted_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`
    ).run(
      bookingId, ref, propertyId, session.user.id, checkIn, checkOut, guests, nights,
      price.nightsSubtotalMinor, price.cleaningFeeMinor, price.serviceFeeMinor, price.taxMinor, price.totalMinor,
      price.currency, initialStatus, specialRequests || null, prop.booking_mode === "INSTANT" ? 1 : 0,
      prop.cancellation_policy,
    );
    db.prepare(
      `INSERT INTO booking_status_history (id,booking_id,to_status,note) VALUES (?,?,?,?)`
    ).run(cuid(), bookingId, initialStatus, "Booking created");

    // Service orders
    for (const so of services) {
      db.prepare(
        `INSERT INTO service_orders (id,booking_id,service_id,quantity,price_minor) VALUES (?,?,?,1,?)`
      ).run(cuid(), bookingId, so.service.id, so.price);
    }

    // Place hold block
    db.prepare(
      `INSERT INTO availability_blocks (id,property_id,start_date,end_date,reason,booking_id) VALUES (?,?,?,?,?,?)`
    ).run(cuid(), propertyId, checkIn, checkOut, "hold", bookingId);

    // Audit
    db.prepare(
      `INSERT INTO audit_logs (id,actor_id,action,target_type,target_id) VALUES (?,?,?,?,?)`
    ).run(cuid(), session.user.id, "BOOKING_CREATED", "booking", bookingId);

    return { bookingId, ref, status: initialStatus };
  });

  try {
    const result = tx();
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Could not book" }, { status: 409 });
  }
}
