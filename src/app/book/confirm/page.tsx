import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { formatMoney } from "@/lib/money";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingConfirmed({ searchParams }: { searchParams: { bookingId?: string; session_id?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  let booking: any = null;
  if (searchParams.bookingId) {
    booking = db.prepare(`
      SELECT b.*, p.name AS property_name, p.slug AS property_slug, p.hero_image_url, p.region_id
      FROM bookings b JOIN properties p ON p.id=b.property_id
      WHERE b.id=? AND b.user_id=?
    `).get(searchParams.bookingId, session.user.id);
  }
  if (!booking) notFound();

  const confirmed = booking.status === "CONFIRMED" || booking.status === "CHECKED_IN" || booking.status === "COMPLETED";

  return (
    <div id="main-content" className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 md:px-10 text-center">
        {confirmed ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-6" />
            <p className="label-gold mb-4">Booking confirmed</p>
            <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-5">Your stay is reserved.</h1>
            <p className="text-charcoal/75 max-w-xl mx-auto leading-relaxed mb-8">
              Reference <b className="text-midnight">{booking.reference}</b>. A confirmation email has been sent. Our concierge will be in touch within 24 hours to help with any arrangements.
            </p>
          </>
        ) : booking.status === "AWAITING_HOST" ? (
          <>
            <div className="h-16 w-16 rounded-full border border-gold flex items-center justify-center mx-auto mb-6">
              <span className="text-gold font-serif text-2xl">?</span>
            </div>
            <p className="label-gold mb-4">Request received</p>
            <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-5">Waiting for host confirmation.</h1>
            <p className="text-charcoal/75 max-w-xl mx-auto leading-relaxed mb-8">
              We have notified the host. You'll receive an email within 24 hours. No payment has been charged yet.
            </p>
          </>
        ) : (
          <>
            <p className="label-gold mb-4">Booking status</p>
            <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-5 capitalize">{booking.status.replace("_"," ")}</h1>
            <p className="text-charcoal/75 max-w-xl mx-auto leading-relaxed mb-8">
              Reference <b>{booking.reference}</b>.
            </p>
          </>
        )}

        <div className="bg-white border border-midnight/10 p-6 text-left max-w-md mx-auto shadow-luxe">
          <p className="text-[11px] uppercase tracking-widest text-stone mb-3">{booking.property_name}</p>
          <p className="text-sm text-charcoal/80">
            {new Date(booking.check_in).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})} – {new Date(booking.check_out).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
          </p>
          <p className="text-sm text-charcoal/80">{booking.guests} guests · {booking.nights} nights</p>
          <div className="divider !my-4" />
          <div className="flex justify-between items-baseline">
            <p className="text-sm text-charcoal/70">Total</p>
            <p className="font-serif text-xl text-midnight">{formatMoney(booking.total_minor, booking.currency)}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/trips" className="btn-gold text-[11px]">View my trips</Link>
          <Link href="/concierge" className="btn-outline text-[11px]">Plan stay details</Link>
        </div>
      </div>
    </div>
  );
}
