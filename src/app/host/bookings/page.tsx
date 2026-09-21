import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function HostBookings() {
  const session = await getSession();
  if (!session) redirect("/login");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const bookings = db.prepare(`
    SELECT b.*, p.name AS property_name FROM bookings b JOIN properties p ON p.id=b.property_id
    WHERE p.host_id=? ORDER BY b.check_in DESC
  `).all(host?.id) as any[];

  return (
    <HostShell active="bookings">
      <p className="label-gold mb-4">Bookings</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Reservations &amp; requests</h1>
      <div className="space-y-3">
        {bookings.length === 0 ? <p className="text-charcoal/70">No bookings yet.</p> : bookings.map(b => (
          <div key={b.id} className="bg-white border border-midnight/10 p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[11px] uppercase tracking-widest text-stone">{b.reference}</p>
                <Badge variant={b.status==='CONFIRMED'?"success":b.status==='AWAITING_HOST'?"warning":"outline"}>{b.status.replace("_"," ")}</Badge>
              </div>
              <p className="font-serif text-midnight">{b.property_name}</p>
              <p className="text-xs text-charcoal/70">{new Date(b.check_in).toLocaleDateString("en-GB")} – {new Date(b.check_out).toLocaleDateString("en-GB")} · {b.guests} guests · {b.nights} nights</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-midnight">{formatMoney(b.total_minor, b.currency)}</p>
            </div>
          </div>
        ))}
      </div>
    </HostShell>
  );
}
