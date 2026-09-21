import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const session = await getSession();
  if (!session) redirect("/login");
  const users = db.prepare(`SELECT id,email,first_name,last_name,role,suspended,created_at FROM users ORDER BY created_at DESC LIMIT 100`).all() as any[];
  return (
    <AdminShell active="users">
      <p className="label-gold mb-4">Users</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">All users</h1>
      <div className="bg-white border border-midnight/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-stone">
            <tr className="border-b"><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Role</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3">{u.first_name} {u.last_name}</td>
                <td className="p-3 text-stone">{u.email}</td>
                <td className="p-3"><Badge variant={u.role==='ADMIN'?"gold":u.role==='HOST'?"dark":"outline"}>{u.role}</Badge></td>
                <td className="p-3"><Badge variant={u.suspended?"danger":"success"}>{u.suspended?"suspended":"active"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
