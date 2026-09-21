import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-transparent border-b border-midnight/20 px-0 py-2 text-sm text-midnight placeholder:text-stone focus:border-gold focus:outline-none transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-transparent border border-midnight/20 px-3 py-2 text-sm text-midnight placeholder:text-stone focus:border-gold focus:outline-none transition-colors resize-none",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("label block mb-1", className)}>
      {children}
    </label>
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full bg-transparent border-b border-midnight/20 px-0 py-2 text-sm text-midnight focus:border-gold focus:outline-none transition-colors appearance-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-stone">{hint}</p> : null}
    </div>
  );
}
