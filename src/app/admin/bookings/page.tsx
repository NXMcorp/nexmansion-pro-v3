import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminBookings() {
  const session = await getSession();
  if (!session) redirect("/login");
  const bookings = db.prepare(`
    SELECT b.*, p.name AS property_name, u.email AS guest_email FROM bookings b
    JOIN properties p ON p.id=b.property_id JOIN users u ON u.id=b.user_id
    ORDER BY b.created_at DESC LIMIT 100
  `).all() as any[];
  return (
    <AdminShell active="bookings">
      <p className="label-gold mb-4">Reservations</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Bookings</h1>
      <div className="bg-white border border-midnight/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-stone">
            <tr className="border-b"><th className="text-left p-3">Ref</th><th className="text-left p-3">Property</th><th className="text-left p-3">Guest</th><th className="text-left p-3">Dates</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="p-3 text-stone">{b.reference}</td>
                <td className="p-3 font-medium">{b.property_name}</td>
                <td className="p-3 text-stone">{b.guest_email}</td>
                <td className="p-3 text-stone text-xs">{new Date(b.check_in).toLocaleDateString("en-GB")} – {new Date(b.check_out).toLocaleDateString("en-GB")}</td>
                <td className="p-3">{formatMoney(b.total_minor, b.currency)}</td>
                <td className="p-3"><Badge variant={b.status==='CONFIRMED'?"success":b.status==='AWAITING_HOST'?"warning":"outline"}>{b.status.replace("_"," ")}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
