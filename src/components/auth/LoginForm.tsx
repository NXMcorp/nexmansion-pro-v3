"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    if (res?.error) { setError("Invalid email or password"); setBusy(false); return; }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <Field label="Email">
          <Input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field label="Password">
          <Input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" />
        </Field>
        {error && <p className="text-sm text-red-900">{error}</p>}
        <Button type="submit" size="lg" className="w-full" loading={busy}>Sign in</Button>
      </form>
      <div className="mt-6 flex justify-between text-xs tracking-widest uppercase">
        <Link href="/forgot-password" className="text-stone hover:text-midnight">Forgot password?</Link>
        <Link href="/signup" className="text-gold hover:text-midnight">Create account</Link>
      </div>
      <div className="mt-10 p-5 border border-midnight/10 text-sm text-charcoal/70">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">Demo credentials</p>
        <p><b>traveller@nexmansion.com</b> / nexmansion123</p>
        <p><b>host@nexmansion.com</b> / nexmansion123</p>
        <p><b>admin@nexmansion.com</b> / nexmansion123</p>
      </div>
    </>
  );
}
