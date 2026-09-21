import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT") redirect("/account");

  const stats = {
    active: (db.prepare(`SELECT COUNT(*) c FROM properties WHERE status='PUBLISHED'`).get() as any).c,
    awaiting: (db.prepare(`SELECT COUNT(*) c FROM properties WHERE status IN ('SUBMITTED','UNDER_REVIEW','CHANGES_REQUESTED')`).get() as any).c,
    verified: (db.prepare(`SELECT COUNT(*) c FROM properties WHERE verified_at IS NOT NULL`).get() as any).c,
    bookingRequests: (db.prepare(`SELECT COUNT(*) c FROM bookings WHERE status='AWAITING_HOST'`).get() as any).c,
    confirmed: (db.prepare(`SELECT COUNT(*) c FROM bookings WHERE status IN ('CONFIRMED','CHECKED_IN')`).get() as any).c,
    gross: (db.prepare(`SELECT COALESCE(SUM(total_minor),0) s FROM bookings WHERE status IN ('CONFIRMED','CHECKED_IN','COMPLETED')`).get() as any).s,
    refunds: (db.prepare(`SELECT COALESCE(SUM(amount_minor),0) s FROM refunds`).get() as any).s,
    openTickets: (db.prepare(`SELECT COUNT(*) c FROM support_tickets WHERE status IN ('open','pending')`).get() as any).c,
    openConcierge: (db.prepare(`SELECT COUNT(*) c FROM concierge_requests WHERE status IN ('received','reviewing','proposed')`).get() as any).c,
    disputes: (db.prepare(`SELECT COUNT(*) c FROM disputes WHERE status IN ('opened','evidence_requested','under_review','proposed_resolution')`).get() as any).c,
  };

  const commissionPct = (db.prepare(`SELECT commission_pct FROM platform_fee_config WHERE active=1 ORDER BY created_at DESC LIMIT 1`).get() as any)?.commission_pct || 2;
  const commissionEst = Math.round(stats.gross * commissionPct / 100);

  return (
    <AdminShell active="overview">
      <p className="label-gold mb-4">Operations</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Active properties" value={String(stats.active)} href="/admin/properties" />
        <Stat label="Awaiting review" value={String(stats.awaiting)} href="/admin/properties" accent />
        <Stat label="Confirmed bookings" value={String(stats.confirmed)} href="/admin/bookings" />
        <Stat label="Booking requests" value={String(stats.bookingRequests)} href="/admin/bookings" accent />
        <Stat label="Gross booking value" value={formatMoney(stats.gross, "EUR")} />
        <Stat label={`Platform commission (${commissionPct}%)`} value={formatMoney(commissionEst, "EUR")} />
        <Stat label="Open concierge" value={String(stats.openConcierge)} href="/admin/concierge" accent />
        <Stat label="Open support" value={String(stats.openTickets)} href="/admin/support" accent />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Pending property reviews" cta="Review queue" href="/admin/properties">
          <QuickList sql={`SELECT p.id,p.name,p.status,hp.company_name, p.created_at FROM properties p LEFT JOIN host_profiles hp ON hp.id=p.host_id WHERE p.status IN ('SUBMITTED','UNDER_REVIEW','CHANGES_REQUESTED') ORDER BY p.created_at ASC LIMIT 5`}
            render={(r:any)=>(<div key={r.id} className="flex justify-between py-2 border-b border-midnight/10 last:border-0">
              <div><p className="text-sm font-medium text-midnight">{r.name}</p><p className="text-xs text-stone">{r.company_name || "—"}</p></div>
              <p className="text-[10px] uppercase tracking-widest text-gold">{r.status.replace("_"," ")}</p>
            </div>)} emptyMessage="No properties awaiting review." />
        </Panel>
        <Panel title="Recent concierge requests" cta="View all" href="/admin/concierge">
          <QuickList sql={`SELECT * FROM concierge_requests ORDER BY created_at DESC LIMIT 5`}
            render={(r:any)=>(<div key={r.id} className="flex justify-between py-2 border-b border-midnight/10 last:border-0">
              <div><p className="text-sm font-medium text-midnight">{r.full_name}</p><p className="text-xs text-stone line-clamp-1">{r.category} · {r.message}</p></div>
              <p className="text-[10px] uppercase tracking-widest text-stone">{r.status}</p>
            </div>)} emptyMessage="No concierge requests." />
        </Panel>
        <Panel title="Open disputes" cta="View all" href="/admin/disputes">
          <QuickList sql={`SELECT d.*, b.reference FROM disputes d JOIN bookings b ON b.id=d.booking_id WHERE d.status NOT IN ('resolved','closed') ORDER BY d.created_at DESC LIMIT 5`}
            render={(r:any)=>(<div key={r.id} className="flex justify-between py-2 border-b border-midnight/10 last:border-0">
              <p className="text-sm">{r.reference} — {r.category}</p>
              <p className="text-[10px] uppercase tracking-widest text-red-900">{r.status}</p>
            </div>)} emptyMessage="No open disputes." />
        </Panel>
        <Panel title="Audit log" cta="View all" href="/admin/audit">
          <QuickList sql={`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5`}
            render={(r:any)=>(<div key={r.id} className="flex justify-between py-2 border-b border-midnight/10 last:border-0">
              <p className="text-sm">{r.action}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone">{new Date(r.created_at).toLocaleString("en-GB",{dateStyle:"short",timeStyle:"short"})}</p>
            </div>)} emptyMessage="No audit events." />
        </Panel>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, href, accent }: { label: string; value: string; href?: string; accent?: boolean }) {
  const inner = (
    <div className={"border p-5 transition-colors " + (accent ? "border-gold bg-white" : "border-midnight/10 bg-white hover:border-midnight")}>
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone mb-2">{label}</p>
      <p className="font-serif text-2xl text-midnight">{value}</p>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function Panel({ title, cta, href, children }: { title: string; cta?: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-midnight/10 p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="label-gold">{title}</p>
        {cta && href && <Link href={href} className="text-[10px] uppercase tracking-widest text-stone hover:text-midnight">{cta} →</Link>}
      </div>
      {children}
    </div>
  );
}

function QuickList({ sql, render, emptyMessage }: { sql: string; render: (r: any) => React.ReactNode; emptyMessage: string }) {
  const rows = db.prepare(sql).all() as any[];
  if (rows.length === 0) return <p className="text-sm text-stone py-6">{emptyMessage}</p>;
  return <div>{rows.map(render)}</div>;
}
