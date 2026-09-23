"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import type { Role } from "@/lib/types";

function isSafeInternalUrl(url: string): boolean {
  if (!url) return false;
  // Must start with single slash
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  // Reject protocol, colon, backslash, double slash encoding tricks
  if (url.includes("://")) return false;
  if (url.includes(":")) return false;
  if (url.includes("\\")) return false;
  // Reject if after decoding it becomes external
  try {
    const decoded = decodeURIComponent(url);
    if (decoded.startsWith("//")) return false;
    if (decoded.includes("://")) return false;
    if (decoded.includes("\\")) return false;
  } catch {
    // If decoding fails, treat as unsafe
    return false;
  }
  // Reject api, login, signup loops
  const path = url.split("?")[0].split("#")[0];
  if (path === "/login" || path.startsWith("/login/")) return false;
  if (path === "/signup" || path.startsWith("/signup/")) return false;
  if (path === "/forgot-password" || path.startsWith("/forgot-password")) return false;
  if (path === "/reset-password" || path.startsWith("/reset-password")) return false;
  if (path.startsWith("/api/")) return false;
  return true;
}

function getDefaultForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
    case "SUPPORT":
      return "/admin";
    case "HOST":
      return "/host";
    case "TRAVELLER":
    default:
      return "/account";
  }
}

function isAuthorizedForDashboard(role: Role, callbackUrl: string): boolean {
  if (!isSafeInternalUrl(callbackUrl)) return false;
  const path = callbackUrl.split("?")[0].split("#")[0];

  // Dashboard roots
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const isHost = path === "/host" || path.startsWith("/host/");
  const isAccount = path === "/account" || path.startsWith("/account/");

  if (isAdmin) {
    return role === "ADMIN" || role === "SUPPORT";
  }
  if (isHost) {
    // HOST primary, but allow ADMIN/SUPPORT as super users to access host area if they explicitly request it
    return role === "HOST" || role === "ADMIN" || role === "SUPPORT";
  }
  if (isAccount) {
    return role === "TRAVELLER";
  }

  // Non-dashboard internal paths (/, /villas, /collections, /about, etc.) are allowed for any role
  return true;
}

function getSafeRedirect(role: Role, rawCallback: string | null): string {
  const fallback = getDefaultForRole(role);

  if (!rawCallback) return fallback;

  // Reject unsafe/external
  if (!isSafeInternalUrl(rawCallback)) return fallback;

  // If it's a dashboard path, check authorization
  if (!isAuthorizedForDashboard(role, rawCallback)) {
    return fallback;
  }

  return rawCallback;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawCallbackUrl = params.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setBusy(false);
      return;
    }

    // After successful signIn, get session to determine role
    try {
      const session = await getSession();
      const role = (session?.user as any)?.role as Role | undefined;

      // If session not yet available, try a short retry (next-auth may need a tick)
      let resolvedRole: Role | undefined = role;
      if (!resolvedRole) {
        // Small delay and retry once
        await new Promise((r) => setTimeout(r, 200));
        const retrySession = await getSession();
        resolvedRole = (retrySession?.user as any)?.role as Role | undefined;
      }

      const finalRole: Role = resolvedRole || "TRAVELLER";
      const safeRedirect = getSafeRedirect(finalRole, rawCallbackUrl);

      router.push(safeRedirect);
      router.refresh();
    } catch {
      // Fallback to account if anything goes wrong, but ensure ADMIN/HOST not sent to /account accidentally
      // We don't know role here, so we try to use callback if safe, otherwise /account
      // However to satisfy "ADMIN must never be sent to /account" we already have role-based logic above
      // If getSession fails, fallback to rawCallback if safe and not dashboard, otherwise /account
      const fallback = rawCallbackUrl && isSafeInternalUrl(rawCallbackUrl) && !rawCallbackUrl.startsWith("/admin") && !rawCallbackUrl.startsWith("/host") ? rawCallbackUrl : "/account";
      router.push(fallback);
      router.refresh();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <Field label="Email">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field label="Password">
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </Field>
        {error && <p className="text-sm text-red-900">{error}</p>}
        <Button type="submit" size="lg" className="w-full" loading={busy}>
          Sign in
        </Button>
      </form>
      <div className="mt-6 flex justify-between text-xs tracking-widest uppercase">
        <Link href="/forgot-password" className="text-stone hover:text-midnight">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-gold hover:text-midnight">
          Create account
        </Link>
      </div>
      <div className="mt-10 p-5 border border-midnight/10 text-sm text-charcoal/70">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">Demo credentials</p>
        <p>
          <b>traveller@nexmansion.com</b> / nexmansion123
        </p>
        <p>
          <b>host@nexmansion.com</b> / nexmansion123
        </p>
        <p>
          <b>admin@nexmansion.com</b> / nexmansion123
        </p>
      </div>
    </>
  );
}
