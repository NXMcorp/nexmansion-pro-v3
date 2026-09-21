import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AccountShell } from "@/components/account/AccountShell";
import db from "@/server/db";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const bookings = db.prepare(`
    SELECT b.*, p.name AS property_name, p.slug AS property_slug, p.hero_image_url AS property_hero, r.name AS region_name
    FROM bookings b JOIN properties p ON p.id=b.property_id
    LEFT JOIN regions r ON r.id = p.region_id
    WHERE b.user_id=? ORDER BY b.check_in DESC
  `).all(session.user.id) as any[];

  const groups = {
    Upcoming: bookings.filter(b => ["CONFIRMED","CHECKED_IN","AWAITING_HOST","AWAITING_PAYMENT","APPROVED","PAYMENT_PROCESSING"].includes(b.status)),
    Past: bookings.filter(b => b.status === "COMPLETED"),
    Cancelled: bookings.filter(b => ["CANCELLED","REFUNDED","DECLINED","EXPIRED"].includes(b.status)),
  };

  return (
    <AccountShell active="trips">
      <p className="label-gold mb-4">My trips</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Your journeys</h1>
      {Object.entries(groups).map(([label, list]) => (
        list.length > 0 && (
          <section key={label} className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone mb-4">{label}</p>
            <div className="space-y-3">
              {list.map(b => (
                <div key={b.id} className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-midnight/10">
                  <Link href={`/villas/${b.property_slug}`} className="relative h-32 md:h-24 w-full md:w-32 shrink-0 bg-sand overflow-hidden">
                    {b.property_hero && <img src={b.property_hero} alt="" className="h-full w-full object-cover" />}
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={b.status==="CONFIRMED"?"success":b.status==="AWAITING_HOST"?"warning":b.status==="COMPLETED"?"dark":"outline"}>
                        {b.status.replace("_"," ")}
                      </Badge>
                      <p className="text-[11px] tracking-widest uppercase text-stone">{b.reference}</p>
                    </div>
                    <Link href={`/villas/${b.property_slug}`}>
                      <h3 className="font-serif text-xl text-midnight hover:text-gold">{b.property_name}</h3>
                    </Link>
                    <p className="text-sm text-charcoal/70 mt-1">{formatDate(b.check_in)} – {formatDate(b.check_out)} · {b.nights} nights · {b.guests} guests</p>
                    {b.status === "COMPLETED" && (
                      <Link href={`/villas/${b.property_slug}#reviews`} className="text-[11px] tracking-widest uppercase text-gold mt-2 inline-block">Leave a review</Link>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-midnight">{formatMoney(b.total_minor, b.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      ))}
      {bookings.length === 0 && (
        <div className="border border-midnight/10 bg-white p-10 text-center">
          <p className="text-charcoal/70 mb-4">No trips yet.</p>
          <Link href="/collections/bali" className="btn-gold text-[11px]">Browse villas</Link>
        </div>
      )}
    </AccountShell>
  );
}
