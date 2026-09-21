import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AccountShell } from "@/components/account/AccountShell";
import db from "@/server/db";
import { formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const payments = db.prepare(`
    SELECT p.*, b.reference, prop.name AS property_name
    FROM payments p JOIN bookings b ON b.id=p.booking_id
    JOIN properties prop ON prop.id=b.property_id
    WHERE b.user_id=? ORDER BY p.created_at DESC
  `).all(session.user.id) as any[];
  return (
    <AccountShell active="payments">
      <p className="label-gold mb-4">Payments</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Payment history</h1>
      {payments.length === 0 ? (
        <p className="text-charcoal/70">No payments yet.</p>
      ) : (
        <div className="border border-midnight/10 bg-white">
          {payments.map(p => (
            <div key={p.id} className="p-5 flex items-center justify-between border-b border-midnight/10 last:border-0">
              <div>
                <p className="font-serif text-midnight">{p.property_name}</p>
                <p className="text-xs text-stone uppercase tracking-widest">{p.reference} · {new Date(p.created_at).toLocaleDateString("en-GB")} · {p.provider}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-serif text-midnight">{formatMoney(p.amount_minor, p.currency)}</p>
                <Badge variant={p.status==="SUCCEEDED"?"success":p.status==="PENDING"?"warning":"outline"}>{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
