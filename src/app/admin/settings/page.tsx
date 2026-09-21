import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const session = await getSession();
  if (!session) redirect("/login");
  const fee = db.prepare(`SELECT * FROM platform_fee_config WHERE active=1 ORDER BY created_at DESC LIMIT 1`).get() as any;
  const flags = db.prepare(`SELECT * FROM feature_flags ORDER BY key`).all() as any[];
  return (
    <AdminShell active="settings">
      <p className="label-gold mb-4">Configuration</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Platform settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-midnight/10 p-6">
          <p className="label mb-4">Commission</p>
          <p className="font-serif text-3xl text-midnight">{fee?.commission_pct ?? 2}%</p>
          <p className="text-xs text-stone uppercase tracking-widest mt-2">Platform commission (default)</p>
        </div>
        <div className="bg-white border border-midnight/10 p-6">
          <p className="label mb-4">Feature flags</p>
          <ul className="space-y-2">
            {flags.map(f => (
              <li key={f.id} className="flex justify-between text-sm">
                <span className="text-midnight">{f.key}</span>
                <span className={f.enabled?"text-emerald-800":"text-stone"}>{f.enabled?"ON":"OFF"}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-stone mt-4 tracking-widest uppercase">Crypto, NexCoin and AI concierge remain OFF for V1 as specified.</p>
        </div>
      </div>
    </AdminShell>
  );
}
