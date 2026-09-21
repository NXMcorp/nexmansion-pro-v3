import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function HostRevenue() {
  const session = await getSession();
  if (!session) redirect("/login");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const rows = db.prepare(`
    SELECT b.status, SUM(b.total_minor) total, COUNT(*) cnt FROM bookings b JOIN properties p ON p.id=b.property_id WHERE p.host_id=? GROUP BY b.status
  `).all(host?.id) as any[];
  const total = rows.reduce((s,r)=>s+(["CONFIRMED","CHECKED_IN","COMPLETED"].includes(r.status)?r.total:0),0);
  const commission = 2;
  return (
    <HostShell active="revenue">
      <p className="label-gold mb-4">Revenue</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-midnight/10 p-5"><p className="text-[11px] tracking-widest uppercase text-stone mb-2">Gross (confirmed/completed)</p><p className="font-serif text-2xl text-midnight">{formatMoney(total, "EUR")}</p></div>
        <div className="bg-white border border-midnight/10 p-5"><p className="text-[11px] tracking-widest uppercase text-stone mb-2">Platform fee ({commission}%)</p><p className="font-serif text-2xl text-midnight">{formatMoney(Math.round(total*commission/100), "EUR")}</p></div>
        <div className="bg-white border border-midnight/10 p-5"><p className="text-[11px] tracking-widest uppercase text-stone mb-2">Net estimate</p><p className="font-serif text-2xl text-gold">{formatMoney(total - Math.round(total*commission/100), "EUR")}</p></div>
      </div>
      <div className="bg-white border border-midnight/10 p-5">
        <p className="label mb-5">By status</p>
        {rows.map(r => (
          <div key={r.status} className="flex justify-between py-2 text-sm border-b border-midnight/5 last:border-0">
            <span className="capitalize text-charcoal">{r.status.replace("_"," ")}</span>
            <span>{r.cnt} · {formatMoney(r.total, "EUR")}</span>
          </div>
        ))}
      </div>
    </HostShell>
  );
}
