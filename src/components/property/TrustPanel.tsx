import { ShieldCheck, IdCard, FileCheck, Image as ImageIcon, CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PropertyVerification } from "@/lib/types";

export function TrustPanel({ verification }: { verification?: PropertyVerification | null }) {
  const items = [
    { ok: !!verification?.host_identity, icon: IdCard, label: "Host identity verified" },
    { ok: !!verification?.property_reviewed, icon: ShieldCheck, label: "Property reviewed in person" },
    { ok: !!verification?.listing_checked, icon: FileCheck, label: "Listing information checked" },
    { ok: !!verification?.imagery_reviewed, icon: ImageIcon, label: "Imagery reviewed" },
  ];
  return (
    <div className="py-10 border-t border-midnight/10">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-6 w-6 text-gold" />
        <p className="label-gold">Nex Verified</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 text-sm">
            <i.icon className={i.ok ? "h-5 w-5 text-gold" : "h-5 w-5 text-stone/50"} />
            <span className={i.ok ? "text-midnight" : "text-stone"}>{i.label}</span>
          </div>
        ))}
      </div>
      {verification?.last_verified_at && (
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-stone flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Last verified {formatDate(verification.last_verified_at)}
        </p>
      )}
    </div>
  );
}
