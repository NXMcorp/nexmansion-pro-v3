import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminPayments() {
  const session = await getSession();
  if (!session) redirect("/login");
  const payments = db.prepare(`
    SELECT p.*, b.reference FROM payments p JOIN bookings b ON b.id=p.booking_id
    ORDER BY p.created_at DESC LIMIT 100
  `).all() as any[];
  return (
    <AdminShell active="payments">
      <p className="label-gold mb-4">Finance</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Payments</h1>
      <div className="bg-white border border-midnight/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-stone">
            <tr className="border-b"><th className="text-left p-3">Ref</th><th className="text-left p-3">Provider</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3 text-stone">{p.reference}</td>
                <td className="p-3">{p.provider}</td>
                <td className="p-3">{formatMoney(p.amount_minor, p.currency)}</td>
                <td className="p-3"><Badge variant={p.status==='SUCCEEDED'?"success":"warning"}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
