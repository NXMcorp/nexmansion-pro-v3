import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import db from "@/server/db";
import { HostShell } from "@/components/host/HostShell";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, FileText, UserCheck, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HostVerification() {
  const session = await getSession();
  if (!session) redirect("/login");
  const host = db.prepare(`SELECT * FROM host_profiles WHERE user_id=?`).get(session.user.id) as any;
  const verified = host?.verification_status === "verified";
  return (
    <HostShell active="verification">
      <p className="label-gold mb-4">Verification</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Host verification</h1>
      <div className="bg-white border border-midnight/10 p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className={verified ? "h-6 w-6 text-gold" : "h-6 w-6 text-stone/50"} />
          <div>
            <p className="font-serif text-xl text-midnight">Status</p>
            <Badge variant={verified ? "success" : "warning"} className="mt-1">{host?.verification_status}</Badge>
          </div>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3"><UserCheck className="h-5 w-5 text-gold"/>Identity verification — {verified ? "Approved" : "Pending review"}</li>
          <li className="flex gap-3"><FileText className="h-5 w-5 text-gold"/>Company / ownership documents — {verified ? "On file" : "Submit in onboarding"}</li>
          <li className="flex gap-3"><Calendar className="h-5 w-5 text-gold"/>Property inspections — scheduled after submission</li>
        </ul>
        <p className="text-xs text-stone mt-6 tracking-widest uppercase">KYC documents are private and never shared publicly.</p>
      </div>
    </HostShell>
  );
}
