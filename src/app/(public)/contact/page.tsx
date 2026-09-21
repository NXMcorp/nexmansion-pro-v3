"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea } from "@/components/ui/Input";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) }).catch(()=>{});
    setSent(true); setBusy(false);
  };

  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="label-gold mb-4">Contact</p>
        <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-8">Speak with us.</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6 text-charcoal/80">
            <div>
              <p className="label mb-2">Concierge</p>
              <p className="text-lg font-serif text-midnight">concierge@nexmansion.com</p>
            </div>
            <div>
              <p className="label mb-2">Press</p>
              <p className="text-lg font-serif text-midnight">press@nexmansion.com</p>
            </div>
            <div>
              <p className="label mb-2">Host partnerships</p>
              <p className="text-lg font-serif text-midnight">hosts@nexmansion.com</p>
            </div>
            <div>
              <p className="label mb-2">Bali office</p>
              <p>Jl. Raya Uluwatu, Badung<br />Bali, Indonesia</p>
            </div>
          </div>
          {sent ? (
            <div className="bg-white border border-gold p-8 h-fit">
              <p className="label-gold mb-3">Thank you</p>
              <p className="font-serif text-xl text-midnight">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 bg-white border border-midnight/10 p-6">
              <Field label="Name"><Input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
              <Field label="Email"><Input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
              <Field label="Subject"><Input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></Field>
              <Field label="Message"><Textarea rows={5} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></Field>
              <Button type="submit" loading={busy} variant="gold">Send</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
