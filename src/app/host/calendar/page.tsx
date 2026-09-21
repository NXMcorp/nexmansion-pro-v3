import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";

export const dynamic = "force-dynamic";

export default async function HostCalendar() {
  const session = await getSession();
  if (!session) redirect("/login");
  const host = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const properties = db.prepare(`SELECT id,name FROM properties WHERE host_id=? ORDER BY name`).all(host?.id) as any[];

  return (
    <HostShell active="calendar">
      <p className="label-gold mb-4">Calendar</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Availability</h1>
      <div className="bg-white border border-midnight/10 p-6">
        <p className="text-sm text-charcoal/70 mb-4">Use the calendar to manage availability and manual blocks. Booked dates are automatically blocked.</p>
        <div className="space-y-4">
          {properties.map(p => (
            <div key={p.id} className="flex items-center justify-between border-b border-midnight/10 pb-3">
              <p className="font-serif text-midnight">{p.name}</p>
              <button className="btn-outline text-[10px]">Edit availability</button>
            </div>
          ))}
          {properties.length === 0 && <p className="text-charcoal/70">No properties to manage yet.</p>}
        </div>
      </div>
    </HostShell>
  );
}
