"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  return (
    <div id="main-content" className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-md px-5">
        <p className="label-gold mb-4 text-center">Password reset</p>
        <h1 className="font-serif text-4xl text-midnight mb-8 text-center">Set a new password</h1>
        {done ? (
          <div className="text-center">
            <p className="text-charcoal/80 mb-6">Your password has been updated.</p>
            <Link href="/login" className="btn-gold text-[11px]">Sign in</Link>
          </div>
        ) : (
          <form onSubmit={(e)=>{e.preventDefault(); setDone(true);}} className="space-y-6">
            <Field label="New password"><Input type="password" required minLength={8} /></Field>
            <Field label="Confirm password"><Input type="password" required minLength={8} /></Field>
            <Button type="submit" size="lg" className="w-full">Update password</Button>
          </form>
        )}
      </div>
    </div>
  );
}
