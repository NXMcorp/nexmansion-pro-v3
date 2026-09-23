"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Menu, X, Heart, User as UserIcon } from "lucide-react";

const navLinks = [
  { href: "/collections/bali", label: "Bali Collection" },
  { href: "/villas", label: "Villas" },
  { href: "/concierge", label: "Concierge" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAcctOpen(false);
  }, [pathname]);

  const onHome = pathname === "/";
  const transparent = onHome && !scrolled;

  const role = (session?.user as any)?.role as string | undefined;

  const dashboardHref =
    role === "ADMIN" || role === "SUPPORT"
      ? "/admin"
      : role === "HOST"
      ? "/host"
      : "/account";

  const dashboardLabel =
    role === "ADMIN" || role === "SUPPORT"
      ? "Operations"
      : role === "HOST"
      ? "Host Dashboard"
      : "My Account";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent text-ivory"
          : "bg-ivory/95 backdrop-blur-md text-midnight border-b border-midnight/10",
      )}
    >
      <nav className="mx-auto max-w-[1500px] px-5 md:px-10 h-16 md:h-20 flex items-center justify-between" aria-label="Primary">
        <Link href="/" className="flex items-center gap-3 group" aria-label="NexMansion home">
          <span
            className={cn(
              "text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-sans transition-colors",
              transparent ? "text-ivory" : "text-gold",
            )}
          >
            NexMansion
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-[11px] tracking-[0.25em] uppercase font-sans transition-colors hover:text-gold",
                  pathname === l.href ? "text-gold" : "",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setAcctOpen((v) => !v)}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase hover:text-gold transition-colors",
                )}
                aria-haspopup="menu"
                aria-expanded={acctOpen}
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden md:inline">
                  {(session.user as any).firstName || "Account"}
                </span>
              </button>
              {acctOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-ivory text-midnight border border-midnight/10 shadow-luxe animate-fade-in">
                  <div className="px-4 py-3 border-b border-midnight/10">
                    <p className="text-sm">{session.user.email}</p>
                    <p className="text-[10px] uppercase tracking-widest text-stone mt-1">
                      {(session.user as any).role}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link href={dashboardHref} className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand">
                        {dashboardLabel}
                      </Link>
                    </li>
                    {(role === "TRAVELLER") && (
                      <>
                        <li><Link href="/account/trips" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand">My Trips</Link></li>
                        <li><Link href="/account/wishlist" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand flex items-center gap-2"><Heart className="h-3 w-3"/> Wishlist</Link></li>
                      </>
                    )}
                    {(role === "HOST") && (
                      <li><Link href="/host/properties" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand">My Properties</Link></li>
                    )}
                    {(role === "ADMIN" || role === "SUPPORT") && (
                      <>
                        <li><Link href="/admin/properties" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand">Properties</Link></li>
                        <li><Link href="/admin/bookings" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-sand">Bookings</Link></li>
                      </>
                    )}
                    <li>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-red-900 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex text-[11px] tracking-[0.25em] uppercase hover:text-gold">
              Sign in
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-midnight text-ivory lg:hidden animate-fade-in" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between h-16 px-5 border-b border-ivory/10">
            <span className="text-[11px] tracking-[0.4em] uppercase">NexMansion</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="p-6 space-y-5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-2xl font-serif">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-6 border-t border-ivory/10 space-y-4">
              {session?.user ? (
                <>
                  <Link href={dashboardHref} className="block text-lg">{dashboardLabel}</Link>
                  {role === "TRAVELLER" && (
                    <>
                      <Link href="/account/trips" className="block text-base opacity-80">My Trips</Link>
                      <Link href="/account/wishlist" className="block text-base opacity-80">Wishlist</Link>
                    </>
                  )}
                  {role === "HOST" && (
                    <Link href="/host/properties" className="block text-base opacity-80">My Properties</Link>
                  )}
                  {(role === "ADMIN" || role === "SUPPORT") && (
                    <>
                      <Link href="/admin/properties" className="block text-base opacity-80">Properties</Link>
                      <Link href="/admin/bookings" className="block text-base opacity-80">Bookings</Link>
                    </>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gold uppercase tracking-widest">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-lg">Sign in</Link>
                  <Link href="/signup" className="block btn-gold w-full">Create account</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
