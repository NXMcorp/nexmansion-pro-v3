import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = db.prepare(`SELECT first_name,last_name,email,phone,country,locale,currency FROM users WHERE id=?`).get(session.user.id) as any;
  const initial = {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email,
    phone: user.phone || "",
    country: user.country || "",
    locale: user.locale || "en",
    currency: user.currency || "EUR",
  };
  return (
    <AccountShell active="profile">
      <p className="label-gold mb-4">Profile</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Personal details</h1>
      <ProfileForm initial={initial} />

      <div className="mt-12 pt-8 border-t border-midnight/10 max-w-xl">
        <p className="label-gold mb-4">Privacy</p>
        <p className="text-sm text-charcoal/70 mb-3">You can export your data or request permanent account deletion at any time.</p>
        <div className="flex gap-3">
          <button type="button" className="px-4 py-2 text-[11px] tracking-[0.25em] uppercase border border-midnight/20 hover:border-midnight">Export data</button>
          <button type="button" className="px-4 py-2 text-[11px] tracking-[0.25em] uppercase bg-red-900 text-ivory hover:bg-red-700">Delete account</button>
        </div>
      </div>
    </AccountShell>
  );
}
