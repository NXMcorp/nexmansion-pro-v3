import clsx, { type ClassValue } from "clsx";

// Simple class-name helper (replaces tailwind-merge to avoid bundling issues in this environment).
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cuid(): string {
  // Lightweight collision-resistant id generator (CUID-like)
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `c${t}${r}`;
}

export function generateReference(prefix = "NX"): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${n}`;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseISODate(s: string): Date {
  return new Date(s + "T00:00:00Z");
}

export function formatDate(s: string | Date, locale = "en-GB", opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof s === "string" ? new Date(s) : s;
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function dateRangeOverlaps(
  aStart: string | Date,
  aEnd: string | Date,
  bStart: string | Date,
  bEnd: string | Date,
): boolean {
  const as = new Date(aStart).getTime();
  const ae = new Date(aEnd).getTime();
  const bs = new Date(bStart).getTime();
  const be = new Date(bEnd).getTime();
  return as < be && bs < ae;
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

export function toMajor(minor: number, currency = "EUR"): number {
  const mult = currency === "IDR" ? 1 : 100;
  return minor / mult;
}
