import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { Badge } from "@/components/ui/Badge";
import { formatMoneyMajor } from "@/lib/money";
import { SafeImg } from "@/components/ui/SafeImage";

export const dynamic = "force-dynamic";

export default async function HostProperties() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/host/properties");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const properties = db.prepare(`SELECT * FROM properties WHERE host_id=? ORDER BY created_at DESC`).all(host?.id) as any[];

  return (
    <HostShell active="properties">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="label-gold mb-4">Properties</p>
          <h1 className="font-serif text-4xl text-midnight">My villas</h1>
        </div>
        <Link href="/host/properties/new" className="btn-gold text-[11px]">Add villa</Link>
      </div>
      <div className="space-y-3">
        {properties.map(p => (
          <div key={p.id} className="bg-white border border-midnight/10 p-4 flex items-center gap-4">
            <div className="relative h-20 w-28 bg-sand overflow-hidden shrink-0">
              {p.hero_image_url && <SafeImg src={p.hero_image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-serif text-lg text-midnight">{p.name}</p>
                <Badge variant={p.status==='PUBLISHED'?"success":"warning"}>{p.status.replace("_"," ")}</Badge>
              </div>
              <p className="text-xs text-stone uppercase tracking-widest">{p.bedrooms} bd · {p.max_guests} guests · {formatMoneyMajor(p.base_price_minor/100, p.currency)}/night</p>
            </div>
            <Link href={`/host/properties/${p.id}`} className="btn-outline text-[10px]">Manage</Link>
          </div>
        ))}
        {properties.length === 0 && <p className="text-charcoal/70">No properties yet.</p>}
      </div>
    </HostShell>
  );
}
