import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onChange, label, className }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer text-sm text-charcoal", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 h-5 w-5 border border-midnight/40 flex items-center justify-center shrink-0 transition-colors",
          checked ? "bg-midnight border-midnight text-gold" : "bg-transparent hover:border-midnight",
        )}
      >
        {checked ? <Check className="h-3 w-3" /> : null}
      </button>
      <span>{label}</span>
    </label>
  );
}
