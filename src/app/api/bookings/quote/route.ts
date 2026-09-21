import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { calculatePrice } from "@/lib/money";
import { serviceLinePrice } from "@/lib/money";
import { isPropertyAvailable } from "@/server/db/availability";

const schema = z.object({
  propertyId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().positive().max(30),
  serviceIds: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ available: false, error: "Invalid request" }, { status: 400 });
  const { propertyId, checkIn, checkOut, guests, serviceIds } = parsed.data;

  const prop = db.prepare(`SELECT * FROM properties WHERE id=? AND status='PUBLISHED'`).get(propertyId) as any;
  if (!prop) return NextResponse.json({ available: false, error: "Property not found" }, { status: 404 });

  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const nights = Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return NextResponse.json({ available: false, error: "Invalid dates" });

  const avail = isPropertyAvailable(propertyId, checkIn, checkOut, guests);
  if (!avail.ok) {
    return NextResponse.json({ available: false, reason: avail.reason });
  }

  const commission = (db.prepare(`SELECT commission_pct FROM platform_fee_config WHERE active=1 ORDER BY created_at DESC LIMIT 1`).get() as any)?.commission_pct ?? 2;

  let servicesMinor = 0;
  if (serviceIds.length) {
    const services = db.prepare(`SELECT * FROM services WHERE id IN (${serviceIds.map(()=>"?").join(",")}) AND active=1`).all(...serviceIds) as any[];
    for (const s of services) servicesMinor += serviceLinePrice(s.price_minor, s.price_model, 1, guests, nights);
  }

  const price = calculatePrice({
    nightlyRateMinor: prop.base_price_minor,
    nights,
    cleaningFeeMinor: prop.cleaning_fee_minor,
    serviceFeePct: prop.service_fee_pct,
    taxPct: prop.tax_pct,
    platformCommissionPct: commission,
    servicesMinor,
    securityDepositMinor: prop.security_deposit_minor,
    currency: prop.currency,
  });

  return NextResponse.json({
    available: true,
    ...price,
  });
}
