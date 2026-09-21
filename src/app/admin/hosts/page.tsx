import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminHosts() {
  const session = await getSession();
  if (!session) redirect("/login");
  const hosts = db.prepare(`
    SELECT hp.*, u.email, u.first_name, u.last_name,
      (SELECT COUNT(*) FROM properties p WHERE p.host_id=hp.id) AS prop_count
    FROM host_profiles hp JOIN users u ON u.id=hp.user_id ORDER BY hp.created_at DESC
  `).all() as any[];
  return (
    <AdminShell active="hosts">
      <p className="label-gold mb-4">Supply</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Hosts</h1>
      <div className="bg-white border border-midnight/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-stone">
            <tr className="border-b"><th className="text-left p-3">Host</th><th className="text-left p-3">Company</th><th className="text-left p-3">Properties</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {hosts.map(h => (
              <tr key={h.id} className="border-b last:border-0 hover:bg-sand/30">
                <td className="p-3"><p className="font-medium">{h.first_name} {h.last_name}</p><p className="text-xs text-stone">{h.email}</p></td>
                <td className="p-3">{h.company_name || "—"}</td>
                <td className="p-3">{h.prop_count}</td>
                <td className="p-3"><Badge variant={h.verification_status==='verified'?"success":"warning"}>{h.verification_status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
