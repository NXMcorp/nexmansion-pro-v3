"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea, Select } from "@/components/ui/Input";

export function NewPropertyForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "", bedrooms: 1, bathrooms: 1,
    maxGuests: 2, basePriceEur: 500, region: "canggu",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/host/properties", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...form, basePriceMinor: Math.round(Number(form.basePriceEur)*100),
      }),
    });
    if (res.ok) { setSubmitted(true); setTimeout(()=>router.push("/host/properties"), 1500); }
    setBusy(false);
  };

  if (submitted) return <p className="text-emerald-900">Submitted — we'll be in touch.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Property name"><Input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Villa Surya" /></Field>
      <Field label="Tagline"><Input value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})} placeholder="A single-line promise" /></Field>
      <Field label="Region">
        <Select value={form.region} onChange={e=>setForm({...form,region:e.target.value})}>
          <option value="uluwatu">Uluwatu</option>
          <option value="ubud">Ubud</option>
          <option value="canggu">Canggu</option>
          <option value="seminyak">Seminyak</option>
          <option value="nusa-dua">Nusa Dua</option>
        </Select>
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Bedrooms"><Input type="number" min={1} value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:Number(e.target.value)})} /></Field>
        <Field label="Bathrooms"><Input type="number" min={1} value={form.bathrooms} onChange={e=>setForm({...form,bathrooms:Number(e.target.value)})} /></Field>
        <Field label="Max guests"><Input type="number" min={1} value={form.maxGuests} onChange={e=>setForm({...form,maxGuests:Number(e.target.value)})} /></Field>
      </div>
      <Field label="Nightly rate (EUR)"><Input type="number" min={50} value={form.basePriceEur} onChange={e=>setForm({...form,basePriceEur:Number(e.target.value)})} /></Field>
      <Field label="Overview / description">
        <Textarea rows={5} required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Tell us about the home." />
      </Field>
      <Button type="submit" loading={busy}>Submit for review</Button>
    </form>
  );
}
