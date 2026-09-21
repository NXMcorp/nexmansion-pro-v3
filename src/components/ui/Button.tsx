import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-midnight text-ivory hover:bg-gold hover:text-midnight",
  gold: "bg-gold text-midnight hover:bg-midnight hover:text-gold",
  outline: "border border-midnight text-midnight hover:bg-midnight hover:text-ivory",
  ghost: "text-midnight/80 hover:text-gold",
  danger: "bg-red-900 text-ivory hover:bg-red-700",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px] tracking-[0.25em]",
  md: "px-6 py-3 text-xs tracking-[0.3em]",
  lg: "px-8 py-4 text-sm tracking-[0.3em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 uppercase font-sans transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
