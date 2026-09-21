import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { formatMoneyMajor } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function EditProperty({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const prop = db.prepare(`SELECT * FROM properties WHERE id=? AND host_id=?`).get(params.id, host?.id) as any;
  if (!prop) notFound();
  return (
    <HostShell active="properties">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/host/properties" className="text-[11px] uppercase tracking-widest text-stone hover:text-midnight">← Back</Link>
      </div>
      <h1 className="font-serif text-4xl text-midnight mb-2">{prop.name}</h1>
      <div className="flex items-center gap-2 mb-8">
        <Badge variant={prop.status==='PUBLISHED'?"success":"warning"}>{prop.status.replace("_"," ")}</Badge>
        <p className="text-xs text-stone uppercase tracking-widest">{prop.bedrooms} bd · {prop.max_guests} guests · {formatMoneyMajor(prop.base_price_minor/100, prop.currency)}/night</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Details & photos","Pricing","Availability","House rules","Services","Verification"].map(s => (
          <div key={s} className="bg-white border border-midnight/10 p-5 hover:border-gold transition-colors cursor-pointer">
            <p className="font-serif text-midnight">{s}</p>
            <p className="text-xs text-stone mt-1">Manage {s.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </HostShell>
  );
}
