import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function HostDashboard() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/host");
  if (session.user.role !== "HOST" && session.user.role !== "ADMIN") redirect("/account");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const hostId = host?.id;

  const stats = {
    properties: (db.prepare(`SELECT COUNT(*) c FROM properties WHERE host_id=?`).get(hostId) as any).c,
    upcoming: (db.prepare(`SELECT COUNT(*) c FROM bookings b JOIN properties p ON p.id=b.property_id WHERE p.host_id=? AND b.status IN ('CONFIRMED','CHECKED_IN') AND b.check_in >= date('now')`).get(hostId) as any).c,
    requests: (db.prepare(`SELECT COUNT(*) c FROM bookings b JOIN properties p ON p.id=b.property_id WHERE p.host_id=? AND b.status IN ('AWAITING_HOST')`).get(hostId) as any).c,
    gross: (db.prepare(`SELECT COALESCE(SUM(total_minor),0) s FROM bookings b JOIN properties p ON p.id=b.property_id WHERE p.host_id=? AND b.status IN ('CONFIRMED','CHECKED_IN','COMPLETED')`).get(hostId) as any).s,
  };
  const commission = (db.prepare(`SELECT commission_pct FROM platform_fee_config WHERE active=1 ORDER BY created_at DESC LIMIT 1`).get() as any)?.commission_pct || 2;
  const platformFee = Math.round(stats.gross * commission / 100);
  const netEst = stats.gross - platformFee;

  const recentBookings = db.prepare(`
    SELECT b.*, p.name AS property_name FROM bookings b JOIN properties p ON p.id=b.property_id
    WHERE p.host_id=? ORDER BY b.created_at DESC LIMIT 6
  `).all(hostId) as any[];

  return (
    <HostShell active="overview">
      <p className="label-gold mb-4">Host dashboard</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Welcome back{session.user.firstName ? `, ${session.user.firstName}` : ""}.</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Properties" value={String(stats.properties)} />
        <Stat label="Upcoming stays" value={String(stats.upcoming)} />
        <Stat label="Awaiting response" value={String(stats.requests)} />
        <Stat label="Gross booking value" value={formatMoney(stats.gross, "EUR")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border border-midnight/10 bg-white p-5">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone mb-2">Platform commission</p>
          <p className="font-serif text-xl text-midnight">{commission}%</p>
          <p className="text-xs text-charcoal/70 mt-2">{formatMoney(platformFee, "EUR")}</p>
        </div>
        <div className="border border-midnight/10 bg-white p-5">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone mb-2">Net estimate</p>
          <p className="font-serif text-xl text-midnight">{formatMoney(netEst, "EUR")}</p>
          <p className="text-xs text-charcoal/70 mt-2">After platform fee</p>
        </div>
        <div className="border border-midnight/10 bg-white p-5 flex flex-col justify-between">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone">Add a new villa</p>
          <Link href="/host/properties/new" className="btn-gold text-[11px] mt-3 self-start">New property</Link>
        </div>
      </div>

      <h2 className="label-gold mb-4">Recent bookings</h2>
      <div className="border border-midnight/10 bg-white">
        {recentBookings.length === 0 ? (
          <p className="p-6 text-charcoal/70 text-sm">No bookings yet.</p>
        ) : recentBookings.map(b => (
          <div key={b.id} className="p-4 border-b border-midnight/10 last:border-0 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone">{b.reference} · <span className="text-gold">{b.status.replace("_"," ")}</span></p>
              <p className="font-serif text-midnight">{b.property_name}</p>
              <p className="text-xs text-charcoal/70">{new Date(b.check_in).toLocaleDateString("en-GB")} – {new Date(b.check_out).toLocaleDateString("en-GB")} · {b.guests} guests</p>
            </div>
            <p className="font-serif text-midnight">{formatMoney(b.total_minor, b.currency)}</p>
          </div>
        ))}
      </div>
    </HostShell>
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
