import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { CalendarDays, Heart, MessageSquare, CreditCard, UserCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { LogoutButton } from "@/components/account/LogoutButton";

const links = [
  { key: "overview", href: "/account", label: "Overview", icon: UserCircle },
  { key: "trips", href: "/account/trips", label: "Trips", icon: CalendarDays },
  { key: "wishlist", href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { key: "messages", href: "/account/messages", label: "Messages", icon: MessageSquare },
  { key: "payments", href: "/account/payments", label: "Payments", icon: CreditCard },
  { key: "profile", href: "/account/profile", label: "Profile", icon: UserCircle },
];

export async function AccountShell({ children, active }: { children: React.ReactNode; active: string }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div id="main-content" className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-midnight/10">
            <div className="h-12 w-12 bg-midnight text-ivory rounded-full flex items-center justify-center font-serif">
              {(session.user.firstName || "N")[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-midnight">{session.user.firstName} {session.user.lastName}</p>
              <p className="text-[11px] text-stone uppercase tracking-widest">{session.user.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link key={l.key} href={l.href}
                  className={"flex items-center gap-3 px-3 py-2.5 text-sm transition-colors " +
                    (active === l.key ? "bg-midnight text-ivory" : "text-charcoal hover:bg-sand")}>
                  <Icon className="h-4 w-4" />
                  {l.label}
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
