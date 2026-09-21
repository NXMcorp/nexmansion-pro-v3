import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminAudit() {
  const session = await getSession();
  if (!session) redirect("/login");
  const logs = db.prepare(`
    SELECT a.*, u.email AS actor_email FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 200
  `).all() as any[];
  return (
    <AdminShell active="audit">
      <p className="label-gold mb-4">Security</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Audit log</h1>
      <div className="bg-white border border-midnight/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-stone">
            <tr className="border-b"><th className="text-left p-3">Time</th><th className="text-left p-3">Actor</th><th className="text-left p-3">Action</th><th className="text-left p-3">Target</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="p-3 text-stone text-xs">{new Date(l.created_at).toLocaleString("en-GB")}</td>
                <td className="p-3 text-stone">{l.actor_email || "—"}</td>
                <td className="p-3 font-medium">{l.action}</td>
                <td className="p-3 text-stone text-xs">{l.target_type} {l.target_id||""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
