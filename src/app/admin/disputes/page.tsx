import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminDisputes() {
  const session = await getSession();
  if (!session) redirect("/login");
  const disputes = db.prepare(`
    SELECT d.*, b.reference FROM disputes d JOIN bookings b ON b.id=d.booking_id ORDER BY d.created_at DESC
  `).all() as any[];
  return (
    <AdminShell active="disputes">
      <p className="label-gold mb-4">Trust &amp; safety</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Disputes</h1>
      <div className="space-y-3">
        {disputes.map(d => (
          <div key={d.id} className="bg-white border border-midnight/10 p-4">
            <div className="flex justify-between mb-1">
              <p className="font-medium">{d.reference} — {d.category}</p>
              <Badge variant={d.status==='resolved'||d.status==='closed'?"success":"danger"}>{d.status}</Badge>
            </div>
            <p className="text-sm text-charcoal/80">{d.description}</p>
          </div>
        ))}
        {disputes.length===0 && <p className="text-charcoal/70">No disputes — good sign.</p>}
      </div>
    </AdminShell>
  );
}
