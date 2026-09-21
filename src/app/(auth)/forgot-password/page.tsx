"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div id="main-content" className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-md px-5">
        <p className="label-gold mb-4 text-center">Password recovery</p>
        <h1 className="font-serif text-4xl text-midnight mb-8 text-center">Forgot password</h1>
        {sent ? (
          <div className="text-center">
            <p className="text-charcoal/80 mb-6">If an account exists for <b>{email}</b>, a password reset link has been sent.</p>
            <Link href="/login" className="btn-gold text-[11px]">Return to sign in</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <Field label="Email"><Input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></Field>
            <Button type="submit" size="lg" className="w-full">Send reset link</Button>
            <p className="text-center text-xs tracking-widest uppercase"><Link href="/login" className="text-stone hover:text-midnight">Back to sign in</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
