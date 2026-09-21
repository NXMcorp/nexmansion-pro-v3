import { cn } from "@/lib/utils";

type Variant = "gold" | "dark" | "light" | "outline" | "success" | "warning" | "danger";

export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-widest font-sans";
  const variants: Record<Variant, string> = {
    gold: "bg-gold text-midnight",
    dark: "bg-midnight text-ivory",
    light: "bg-sand text-charcoal",
    outline: "border border-midnight/20 text-midnight/70",
    success: "bg-emerald-900 text-emerald-50",
    warning: "bg-amber-700 text-amber-50",
    danger: "bg-red-900 text-red-50",
  };
  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}
