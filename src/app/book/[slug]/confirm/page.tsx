import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { formatMoney } from "@/lib/money";
import { ConfirmBookingClient } from "@/components/booking/ConfirmBookingClient";

export const dynamic = "force-dynamic";

export default async function ConfirmBooking({ params, searchParams }: { params: { slug: string }; searchParams: { bookingId?: string } }) {
  const session = await getSession();
  if (!session) redirect(`/login?callbackUrl=/book/${params.slug}/confirm?bookingId=${searchParams.bookingId}`);

  if (!searchParams.bookingId) redirect(`/villas/${params.slug}`);

  const row = db.prepare(`
    SELECT b.*, p.name AS property_name, p.slug AS property_slug, p.hero_image_url AS property_hero, p.cancellation_policy,
           p.check_in_time, p.check_out_time, p.base_price_minor
    FROM bookings b JOIN properties p ON p.id = b.property_id
    WHERE b.id=? AND b.user_id=?
  `).get(searchParams.bookingId, session.user.id) as any;
  if (!row) notFound();

  const services = db.prepare(`
    SELECT so.*, s.name AS service_name, s.category FROM service_orders so JOIN services s ON s.id=so.service_id WHERE so.booking_id=?
  `).all(row.id) as any[];

  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <p className="label-gold mb-4">Step 2 of 3 · Experience &amp; Confirmation</p>
        <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-10">Confirm your stay</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
          <div className="space-y-10">
            <div className="flex gap-5 items-start bg-white border border-midnight/10 p-5">
              <div className="relative h-28 w-40 shrink-0 overflow-hidden bg-sand">
                <Image src={row.property_hero} alt={row.property_name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.3em] uppercase text-stone mb-1">{row.reference}</p>
                <h2 className="font-serif text-2xl text-midnight mb-1">{row.property_name}</h2>
                <p className="text-sm text-charcoal/70">
                  {new Date(row.check_in).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} — {new Date(row.check_out).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                  <span className="mx-2 text-midnight/20">|</span>
                  {row.guests} guest{row.guests>1?"s":""}
                  <span className="mx-2 text-midnight/20">|</span>
                  {row.nights} nights
                </p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/villas/${row.property_slug}`} className="text-[11px] tracking-widest uppercase text-gold underline underline-offset-4">View villa</Link>
                </div>
              </div>
            </div>
            <ConfirmBookingClient booking={row} services={services} />
          </div>
          <aside>
            <div className="sticky top-28 bg-white border border-midnight/10 p-6 shadow-luxe">
              <p className="label mb-5">Price summary</p>
              <div className="space-y-2 text-sm">
                <Row label={`${formatMoney(row.nights_subtotal_minor/row.nights, row.currency)} × ${row.nights} nights`} value={formatMoney(row.nights_subtotal_minor, row.currency)} />
                <Row label="Cleaning fee" value={formatMoney(row.cleaning_fee_minor, row.currency)} />
                {services.length > 0 && (
                  <Row label="Add-on services" value={formatMoney(services.reduce((s,x)=>s+x.price_minor,0), row.currency)} />
                )}
                <Row label="Taxes" value={formatMoney(row.tax_minor, row.currency)} />
                <div className="pt-3 border-t border-midnight/10 flex justify-between items-baseline">
                  <p className="font-serif text-midnight">Total</p>
                  <p className="font-serif text-2xl text-midnight">{formatMoney(row.total_minor, row.currency)}</p>
                </div>
              </div>
              <div className="mt-5 text-[11px] text-stone leading-relaxed space-y-2">
                <p>Cancellation policy: <b className="text-midnight capitalize">{row.cancellation_policy}</b></p>
                <p>Secure payment processed via Stripe. No card details stored.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-charcoal/70">{label}</span>
      <span className="text-midnight">{value}</span>
    </div>
  );
}
