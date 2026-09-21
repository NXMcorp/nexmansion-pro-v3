import { NextResponse } from "next/server";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid } from "@/lib/utils";

// Payment endpoint — uses Stripe when STRIPE_SECRET_KEY is configured,
// otherwise simulates successful test payment for demonstration.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const booking = db.prepare(`SELECT * FROM bookings WHERE id=? AND user_id=?`).get(params.id, session.user.id) as any;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (!["AWAITING_PAYMENT","PAYMENT_PROCESSING","APPROVED"].includes(booking.status)) {
    return NextResponse.json({ error: `Cannot pay in state ${booking.status}` }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" as any });
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{
          price_data: {
            currency: booking.currency.toLowerCase(),
            product_data: { name: `NexMansion — Booking ${booking.reference}` },
            unit_amount: booking.total_minor,
          },
          quantity: 1,
        }],
        metadata: { bookingId: booking.id },
        success_url: `${base}/book/confirm?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/account/trips`,
      });
      db.prepare(`INSERT INTO payments (id,booking_id,amount_minor,currency,provider,status,provider_session_id) VALUES (?,?,?,?,?,?,?)`).run(
        cuid(), booking.id, booking.total_minor, booking.currency, "STRIPE", "PENDING", session.id,
      );
      db.prepare(`UPDATE bookings SET status='PAYMENT_PROCESSING' WHERE id=?`).run(booking.id);
      return NextResponse.json({ checkoutUrl: session.url });
    } catch (e: any) {
      console.error("Stripe error", e);
      return NextResponse.json({ error: "Payment provider error" }, { status: 500 });
    }
  }

  // Demo mode: immediately mark as succeeded (for preview without Stripe keys)
  db.prepare(`UPDATE bookings SET status='CONFIRMED' WHERE id=?`).run(booking.id);
  db.prepare(`INSERT INTO payments (id,booking_id,amount_minor,currency,provider,status) VALUES (?,?,?,?,?,?)`).run(
    cuid(), booking.id, booking.total_minor, booking.currency, "MANUAL", "SUCCEEDED"
  );
  db.prepare(`UPDATE availability_blocks SET reason='booking' WHERE booking_id=?`).run(booking.id);
  db.prepare(`INSERT INTO booking_status_history (id,booking_id,from_status,to_status,note) VALUES (?,?,?,?,?)`).run(
    cuid(), booking.id, booking.status, "CONFIRMED", "Demo confirmation"
  );
  return NextResponse.json({ ok: true, demo: true, redirect: `/book/confirm?bookingId=${booking.id}` });
}
