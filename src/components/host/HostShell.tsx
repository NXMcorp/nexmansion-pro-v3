import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { LayoutDashboard, Home, Calendar, BookOpen, MessageSquare, DollarSign, ShieldCheck, LogOut } from "lucide-react";
import { LogoutButton } from "@/components/account/LogoutButton";

const links = [
  { key: "overview", href: "/host", label: "Overview", icon: LayoutDashboard },
  { key: "properties", href: "/host/properties", label: "Properties", icon: Home },
  { key: "calendar", href: "/host/calendar", label: "Calendar", icon: Calendar },
  { key: "bookings", href: "/host/bookings", label: "Bookings", icon: BookOpen },
  { key: "messages", href: "/host/messages", label: "Messages", icon: MessageSquare },
  { key: "revenue", href: "/host/revenue", label: "Revenue", icon: DollarSign },
  { key: "verification", href: "/host/verification", label: "Verification", icon: ShieldCheck },
];

export async function HostShell({ children, active }: { children: React.ReactNode; active: string }) {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/host");
  if (session.user.role !== "HOST" && session.user.role !== "ADMIN") redirect("/account");
  const host = db.prepare(`SELECT * FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;

  return (
    <div id="main-content" className="pt-24 pb-20 min-h-screen bg-sand/30">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="mb-8 pb-6 border-b border-midnight/10">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Host</p>
            <p className="font-serif text-2xl text-midnight">{host?.company_name || "Host Dashboard"}</p>
            <p className="text-xs text-stone uppercase tracking-widest mt-2">Status: {host?.verification_status || "unverified"}</p>
          </div>
          <nav className="space-y-1">
            {links.map(l => {
              const Icon = l.icon;
              return (
                <Link key={l.key} href={l.href}
                  className={"flex items-center gap-3 px-3 py-2.5 text-sm transition-colors " +
                    (active === l.key ? "bg-midnight text-ivory" : "text-charcoal hover:bg-sand")}>
                  <Icon className="h-4 w-4" />{l.label}
                </Link>
              );
            })}
            <LogoutButton />
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
