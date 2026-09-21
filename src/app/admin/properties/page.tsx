import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { formatMoneyMajor } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProperties() {
  const session = await getSession();
  if (!session) redirect("/login");
  const props = db.prepare(`
    SELECT p.*, r.name AS region_name, d.name AS destination_name, hp.company_name
    FROM properties p LEFT JOIN regions r ON r.id=p.region_id
    LEFT JOIN destinations d ON d.id=p.destination_id
    LEFT JOIN host_profiles hp ON hp.id=p.host_id
    ORDER BY p.created_at DESC
  `).all() as any[];
  return (
    <AdminShell active="properties">
      <p className="label-gold mb-4">Inventory</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Properties</h1>
      <div className="bg-white border border-midnight/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-stone">
              <tr className="border-b border-midnight/10">
                <th className="text-left p-3">Property</th>
                <th className="text-left p-3">Host</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Rate</th>
                <th className="text-left p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {props.map(p => (
                <tr key={p.id} className="border-b border-midnight/10 last:border-0 hover:bg-sand/50">
                  <td className="p-3"><p className="font-serif text-midnight">{p.name}</p></td>
                  <td className="p-3 text-stone">{p.company_name || "—"}</td>
                  <td className="p-3 text-stone">{p.region_name || p.destination_name}</td>
                  <td className="p-3">{formatMoneyMajor(p.base_price_minor/100, p.currency)}</td>
                  <td className="p-3"><Badge variant={p.status==='PUBLISHED'?"success":p.status==='SUSPENDED'?"danger":p.status==='VERIFIED'?"success":"warning"}>{p.status.replace("_"," ")}</Badge></td>
                  <td className="p-3 text-right"><Link href={`/villas/${p.slug}`} className="text-[10px] uppercase tracking-widest text-gold">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
