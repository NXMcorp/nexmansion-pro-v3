import Link from "next/link";
import db from "@/server/db";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export function AccountOverview({ userId }: { userId: string }) {
  const bookings = db.prepare(`
    SELECT b.*, p.name AS property_name, p.slug AS property_slug, p.hero_image_url AS property_hero
    FROM bookings b JOIN properties p ON p.id = b.property_id
    WHERE b.user_id=? ORDER BY b.check_in DESC LIMIT 5
  `).all(userId) as any[];
  const upcoming = bookings.filter(b => ["CONFIRMED","CHECKED_IN","AWAITING_HOST","AWAITING_PAYMENT","APPROVED"].includes(b.status));
  const favCount = (db.prepare(`SELECT COUNT(*) c FROM favorites WHERE user_id=?`).get(userId) as any).c;
  const totalSpent = db.prepare(`SELECT COALESCE(SUM(total_minor),0) s FROM bookings WHERE user_id=? AND status IN ('CONFIRMED','CHECKED_IN','COMPLETED')`).get(userId) as any;

  return (
    <div>
      <p className="label-gold mb-4">My account</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Welcome back.</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Upcoming trips" value={String(upcoming.length)} />
        <Stat label="Wishlist" value={String(favCount)} />
        <Stat label="Total spent" value={formatMoney(totalSpent.s || 0, "EUR")} />
        <Stat label="Stays" value={String(bookings.filter(b=>b.status==='COMPLETED').length)} />
      </div>

      <h2 className="label-gold mb-4">Recent bookings</h2>
      {bookings.length === 0 ? (
        <div className="border border-midnight/10 bg-white p-8 text-center">
          <p className="text-charcoal/70 mb-4">You don't have any bookings yet.</p>
          <Link href="/collections/bali" className="btn-gold text-[11px]">Explore villas</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => <BookingRow key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-midnight/10 bg-white p-5">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone mb-2">{label}</p>
      <p className="font-serif text-2xl text-midnight">{value}</p>
    </div>
  );
}

function BookingRow({ b }: { b: any }) {
  return (
    <Link href={`/account/trips`} className="flex items-center gap-4 p-4 bg-white border border-midnight/10 hover:border-gold transition-colors">
      <div className="relative h-20 w-28 shrink-0 bg-sand overflow-hidden">
        {b.property_hero && <img src={b.property_hero} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1">
        <p className="text-[11px] tracking-widest uppercase text-stone">{b.reference} · <span className="text-gold">{b.status.replace("_"," ")}</span></p>
        <p className="font-serif text-lg text-midnight">{b.property_name}</p>
        <p className="text-xs text-charcoal/70">{formatDate(b.check_in)} – {formatDate(b.check_out)} · {b.nights} nights · {b.guests} guests</p>
      </div>
      <div className="text-right">
        <p className="font-serif text-midnight">{formatMoney(b.total_minor, b.currency)}</p>
      </div>
    </Link>
  );
}
