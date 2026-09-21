import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid } from "@/lib/utils";
import { serviceLinePrice } from "@/lib/money";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = db.prepare(`SELECT * FROM bookings WHERE id=? AND user_id=?`).get(params.id, session.user.id) as any;
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(()=>({}));
  const { serviceIds, specialRequests } = z.object({
    serviceIds: z.array(z.string()).default([]),
    specialRequests: z.string().max(2000).optional(),
  }).parse(body);

  db.prepare(`DELETE FROM service_orders WHERE booking_id=?`).run(params.id);
  let servicesMinor = 0;
  for (const sid of serviceIds) {
    const s = db.prepare(`SELECT * FROM services WHERE id=? AND active=1`).get(sid) as any;
    if (!s) continue;
    const price = serviceLinePrice(s.price_minor, s.price_model, 1, b.guests, b.nights);
    servicesMinor += price;
    db.prepare(`INSERT INTO service_orders (id,booking_id,service_id,quantity,price_minor) VALUES (?,?,?,1,?)`).run(cuid(), params.id, sid, price);
  }
  const newTotal = b.nights_subtotal_minor + b.cleaning_fee_minor + b.tax_minor + servicesMinor;
  db.prepare(`UPDATE bookings SET total_minor=?, special_requests=COALESCE(?, special_requests) WHERE id=?`).run(newTotal, specialRequests ?? null, params.id);

  return NextResponse.json({ ok: true, totalMinor: newTotal, servicesMinor });
}
