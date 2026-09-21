"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea, Select } from "@/components/ui/Input";
import { ConciergeBell } from "lucide-react";

const categories = [
  { v: "airport_transport", l: "Airport transfers" },
  { v: "chef", l: "Private chef" },
  { v: "driver", l: "Private driver" },
  { v: "restaurant", l: "Restaurant reservations" },
  { v: "wellness", l: "Spa & wellness" },
  { v: "groceries", l: "Grocery pre-stocking" },
  { v: "activities", l: "Activities & experiences" },
  { v: "celebration", l: "Celebration preparation" },
  { v: "childcare", l: "Childcare" },
  { v: "other", l: "Other request" },
];

export default function ConciergePage() {
  const [form, setForm] = useState({ fullName:"", email:"", category:"airport_transport", message:"", contactMethod:"email", occasion:"", urgency:"normal", checkIn:"", checkOut:"" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const res = await fetch("/api/concierge", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    if (res.ok) setSent(true);
    else setError("Something went wrong, please email concierge@nexmansion.com");
    setBusy(false);
  };

  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <div className="flex items-center gap-3 text-gold mb-4"><ConciergeBell className="h-5 w-5"/><p className="label-gold">Concierge</p></div>
        <h1 className="font-serif text-4xl md:text-6xl text-midnight mb-6">Plan a remarkable stay.</h1>
        <p className="text-charcoal/75 text-lg leading-relaxed max-w-2xl mb-10">
          Our concierge team arranges every detail of your trip — from airport transfers and private chefs to restaurant reservations, celebrations and experiences. Tell us what you have in mind.
        </p>

        {sent ? (
          <div className="bg-white border border-gold p-8 text-center">
            <p className="label-gold mb-3">Request received</p>
            <p className="font-serif text-2xl text-midnight mb-4">Thank you.</p>
            <p className="text-charcoal/75">A member of the NexMansion concierge team will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white border border-midnight/10 p-6 md:p-10 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full name"><Input required value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} /></Field>
              <Field label="Email"><Input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></Field>
              <Field label="Category">
                <Select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {categories.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
                </Select>
              </Field>
              <Field label="Urgency">
                <Select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}>
                  <option value="normal">Planning ahead</option>
                  <option value="soon">Within a week</option>
                  <option value="urgent">Urgent (24-48 hours)</option>
                </Select>
              </Field>
              <Field label="Check-in (optional)"><Input type="date" value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})} /></Field>
              <Field label="Check-out (optional)"><Input type="date" value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})} /></Field>
              <Field label="Special occasion (optional)"><Input value={form.occasion} onChange={e=>setForm({...form,occasion:e.target.value})} placeholder="Anniversary, birthday, proposal…" /></Field>
              <Field label="Preferred contact">
                <Select value={form.contactMethod} onChange={e=>setForm({...form,contactMethod:e.target.value})}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </Select>
              </Field>
            </div>
            <Field label="How can we help?">
              <Textarea rows={6} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your trip and what you'd like arranged." />
            </Field>
            {error && <p className="text-sm text-red-900">{error}</p>}
            <Button type="submit" size="lg" variant="gold" loading={busy}>Send request</Button>
          </form>
        )}
      </div>
    </div>
  );
}
