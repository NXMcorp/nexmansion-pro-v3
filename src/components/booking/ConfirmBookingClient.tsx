"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import Link from "next/link";
import { ConciergeBell } from "lucide-react";

export function ConfirmBookingClient({ booking, services: _initialSelected }: { booking: any; services: any[] }) {
  const router = useRouter();
  const [addOns, setAddOns] = useState<Record<string, boolean>>({});
  const [allServices, setAllServices] = useState<any[] | null>(null);
  const [terms, setTerms] = useState(false);
  const [houseRules, setHouseRules] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetch(`/api/bookings/${booking.id}/available-services`)
      .then(r => r.json())
      .then(d => setAllServices(d.services || []));
  }, [booking.id]);

  const onPay = async () => {
    if (!terms || !houseRules) { setError("Please accept the terms and house rules."); return; }
    setBusy(true); setError(null);
    const addServiceIds = Object.entries(addOns).filter(([,v])=>v).map(([k])=>k);
    await fetch(`/api/bookings/${booking.id}/services`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ serviceIds: addServiceIds, specialRequests: requests }),
    });
    const res = await fetch(`/api/bookings/${booking.id}/pay`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else router.push(data.redirect || `/book/confirm?bookingId=${booking.id}`);
    } else {
      setError(data.error || "Payment failed");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-10">
      <section>
        <p className="label-gold mb-4">Step 2 · Add concierge services</p>
        <h3 className="font-serif text-2xl text-midnight mb-3">Enhance your stay</h3>
        <p className="text-charcoal/70 text-sm mb-5">Optional — your concierge will confirm arrangements after booking.</p>
        {!allServices ? <div className="h-20 skeleton" /> : allServices.length === 0 ? (
          <p className="text-sm text-stone">No additional services are listed for this property yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allServices.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setAddOns({ ...addOns, [s.id]: !addOns[s.id] })}
                className={
                  "text-left p-4 border transition-colors " +
                  (addOns[s.id] ? "border-midnight bg-midnight/5" : "border-midnight/10 hover:border-midnight/40")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-midnight">{s.name}</p>
                    <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">{s.description}</p>
                  </div>
                  <p className="text-xs text-gold whitespace-nowrap">{priceLabel(s)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="label-gold mb-4">Special requests</p>
        <textarea
          value={requests}
          onChange={(e)=>setRequests(e.target.value)}
          rows={4}
          placeholder="Anything we should know — allergies, arrival times, celebrations…"
          className="w-full border border-midnight/20 p-3 text-sm focus:border-gold focus:outline-none resize-none"
        />
      </section>

      <section>
        <p className="label-gold mb-4">Step 3 · Confirm &amp; pay</p>
        <div className="space-y-3 text-sm">
          <Checkbox checked={terms} onChange={setTerms} label={<>I agree to the <Link href="/terms" className="underline" target="_blank">booking terms</Link> and <Link href="/privacy" className="underline" target="_blank">privacy policy</Link>.</>} />
          <Checkbox checked={houseRules} onChange={setHouseRules} label={<>I have read and accept the house rules and cancellation policy.</>} />
        </div>
        {error && <p className="text-red-900 text-sm mt-3">{error}</p>}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button onClick={onPay} size="lg" variant="gold" loading={busy} disabled={!terms || !houseRules}>
            {booking.status === "AWAITING_HOST" ? "Submit request" : "Confirm and pay"}
          </Button>
          <p className="text-[11px] text-stone uppercase tracking-widest flex items-center gap-2">
            <ConciergeBell className="h-4 w-4 text-gold" /> Concierge support after booking
          </p>
        </div>
      </section>
    </div>
  );
}

function priceLabel(s: any) {
  if (s.price_minor === 0 || s.price_model === "QUOTE") return "Quote";
  const major = s.price_minor / 100;
  const cur = s.currency || "EUR";
  const symbol = cur === "EUR" ? "€" : cur === "USD" ? "$" : cur;
  const per = s.price_model === "PER_GUEST" ? "/guest" : s.price_model === "PER_DAY" ? "/day" : s.price_model === "PER_TRIP" ? "/trip" : "";
  return `${symbol}${major.toLocaleString()}${per}`;
}
