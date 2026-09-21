import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminConcierge() {
  const session = await getSession();
  if (!session) redirect("/login");
  const reqs = db.prepare(`SELECT * FROM concierge_requests ORDER BY created_at DESC LIMIT 100`).all() as any[];
  return (
    <AdminShell active="concierge">
      <p className="label-gold mb-4">Concierge</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Guest requests</h1>
      <div className="space-y-3">
        {reqs.map(r => (
          <div key={r.id} className="bg-white border border-midnight/10 p-4 flex items-start gap-4">
            <div className="flex-1">
              <p className="font-medium text-midnight">{r.full_name} <span className="text-stone text-xs">· {r.email}</span></p>
              <p className="text-xs text-gold uppercase tracking-widest mt-1">{r.category} · {r.urgency}</p>
              <p className="text-sm text-charcoal/80 mt-2">{r.message}</p>
            </div>
            <Badge variant={r.status==='completed'?"success":r.status==='confirmed'?"success":"warning"}>{r.status}</Badge>
          </div>
        ))}
        {reqs.length===0 && <p className="text-charcoal/70">No concierge requests yet.</p>}
      </div>
    </AdminShell>
  );
}
