"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "TRAVELLER" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { const d = await res.json(); setError(d.error || "Could not create account"); setBusy(false); return; }
    const s = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (s?.error) { setError("Account created, but sign-in failed"); setBusy(false); return; }
    router.push(form.role === "HOST" ? "/host" : "/account");
    router.refresh();
  };

  return (
    <div id="main-content" className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-md px-5">
        <p className="label-gold mb-4 text-center">Join NexMansion</p>
        <h1 className="font-serif text-4xl text-midnight mb-8 text-center">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name"><Input required value={form.firstName} onChange={(e)=>setForm({...form,firstName:e.target.value})} /></Field>
            <Field label="Last name"><Input required value={form.lastName} onChange={(e)=>setForm({...form,lastName:e.target.value})} /></Field>
          </div>
          <Field label="Email"><Input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} autoComplete="email" /></Field>
          <Field label="Password" hint="At least 8 characters"><Input type="password" required minLength={8} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} autoComplete="new-password" /></Field>
          <Field label="I am joining as">
            <Select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
              <option value="TRAVELLER">Traveller — booking stays</option>
              <option value="HOST">Host — listing a property</option>
            </Select>
          </Field>
          {error && <p className="text-sm text-red-900">{error}</p>}
          <Button type="submit" size="lg" className="w-full" loading={busy}>Create account</Button>
        </form>
        <p className="mt-6 text-center text-xs tracking-widest uppercase text-stone">
          Already have an account? <Link href="/login" className="text-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
