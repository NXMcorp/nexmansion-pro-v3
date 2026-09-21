import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { LayoutDashboard, Home, Users, UserCircle2, BookOpen, CreditCard, ConciergeBell, LifeBuoy, AlertTriangle, Settings, History, LogOut } from "lucide-react";
import { LogoutButton } from "@/components/account/LogoutButton";

const links = [
  { key: "overview", href: "/admin", label: "Overview", icon: LayoutDashboard },
  { key: "properties", href: "/admin/properties", label: "Properties", icon: Home },
  { key: "hosts", href: "/admin/hosts", label: "Hosts", icon: Users },
  { key: "users", href: "/admin/users", label: "Users", icon: UserCircle2 },
  { key: "bookings", href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { key: "payments", href: "/admin/payments", label: "Payments", icon: CreditCard },
  { key: "concierge", href: "/admin/concierge", label: "Concierge", icon: ConciergeBell },
  { key: "support", href: "/admin/support", label: "Support", icon: LifeBuoy },
  { key: "disputes", href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { key: "settings", href: "/admin/settings", label: "Settings", icon: Settings },
  { key: "audit", href: "/admin/audit", label: "Audit log", icon: History },
];

export async function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT") redirect("/account");
  return (
    <div id="main-content" className="pt-24 pb-20 min-h-screen bg-sand/30">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="mb-8 pb-6 border-b border-midnight/10">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold">NexMansion</p>
            <p className="font-serif text-2xl text-midnight">Operations</p>
            <p className="text-xs text-stone uppercase tracking-widest mt-2">{session.user.role}</p>
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
