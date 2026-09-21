import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminSupport() {
  const session = await getSession();
  if (!session) redirect("/login");
  const tickets = db.prepare(`
    SELECT t.*, u.email FROM support_tickets t JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC
  `).all() as any[];
  return (
    <AdminShell active="support">
      <p className="label-gold mb-4">Support</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Tickets</h1>
      <div className="space-y-3">
        {tickets.map(t => (
          <div key={t.id} className="bg-white border border-midnight/10 p-4">
            <div className="flex justify-between mb-1">
              <p className="font-medium">{t.subject}</p>
              <Badge variant={t.priority==='high'||t.priority==='urgent'?"danger":"warning"}>{t.status}</Badge>
            </div>
            <p className="text-xs text-stone uppercase tracking-widest">{t.email} · {t.category} · {t.priority}</p>
            <p className="text-sm text-charcoal/80 mt-2">{t.message}</p>
          </div>
        ))}
        {tickets.length===0 && <p className="text-charcoal/70">No support tickets.</p>}
      </div>
    </AdminShell>
  );
}
