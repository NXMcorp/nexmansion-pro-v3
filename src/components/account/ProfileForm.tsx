"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select } from "@/components/ui/Input";

export function ProfileForm({ initial }: { initial: any }) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setBusy(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name"><Input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></Field>
        <Field label="Last name"><Input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></Field>
      </div>
      <Field label="Email"><Input type="email" value={form.email} disabled /></Field>
      <Field label="Phone"><Input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></Field>
      <Field label="Country"><Input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Language">
          <Select value={form.locale} onChange={e=>setForm({...form,locale:e.target.value})}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </Select>
        </Field>
        <Field label="Currency">
          <Select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — US Dollar</option>
            <option value="IDR">IDR — Rupiah</option>
          </Select>
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="md" loading={busy}>Save changes</Button>
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
      </div>
    </form>
  );
}
