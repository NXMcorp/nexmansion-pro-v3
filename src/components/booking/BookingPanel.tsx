"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { PropertyWithJoins } from "@/server/db/properties";
import { Button } from "@/components/ui/Button";
import { nightsBetween, formatMoney, formatMoneyMajor } from "@/lib/money";
import { ShieldCheck } from "lucide-react";

export function BookingPanel({ property }: { property: PropertyWithJoins }) {
  const router = useRouter();
  const { data: session } = useSession();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + property.min_stay_nights);
  const defCo = new Date(tomorrow);
  defCo.setDate(defCo.getDate() + 1);

  const [checkIn, setCheckIn] = useState(today.toISOString().slice(0,10));
  const [checkOut, setCheckOut] = useState(defCo.toISOString().slice(0,10));
  const [guests, setGuests] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<{ totalMinor: number; nights: number; nightlyMinor: number; cleaningMinor: number; taxMinor: number; serviceMinor: number; available: boolean; reason?: string } | null>(null);

  const minCheckout = useMemo(() => {
    const d = new Date(checkIn);
    d.setDate(d.getDate() + property.min_stay_nights);
    return d.toISOString().slice(0,10);
  }, [checkIn, property.min_stay_nights]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bookings/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id, checkIn, checkOut, guests, serviceIds: [] }),
      });
      const data = await res.json();
      setPrice(data);
      if (!data.available) setError(data.reason || "Unavailable");
      else setError(null);
    }
    load();
  }, [property.id, checkIn, checkOut, guests]);

  const onReserve = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: property.id, checkIn, checkOut, guests, serviceIds: [] }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setBusy(false);
      return;
    }
    router.push(`/book/${property.slug}/confirm?bookingId=${data.bookingId}`);
    setBusy(false);
  };

  return (
    <div className="border border-midnight/10 bg-white p-6 shadow-luxe">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="font-serif text-3xl text-midnight">{formatMoneyMajor(property.base_price_minor / 100, property.currency)}</p>
          <p className="text-[10px] uppercase tracking-widest text-stone mt-1">per night</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <ShieldCheck className="h-4 w-4 text-gold" />
          <span className="text-[11px] uppercase tracking-widest text-stone">Nex Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-2 border border-midnight/20">
        <label className="p-3 border-r border-midnight/20">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-1">Check-in</p>
          <input type="date" value={checkIn} min={today.toISOString().slice(0,10)} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm focus:outline-none" />
        </label>
        <label className="p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-1">Check-out</p>
          <input type="date" value={checkOut} min={minCheckout} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm focus:outline-none" />
        </label>
        <label className="col-span-2 p-3 border-t border-midnight/20">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-1">Guests</p>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full text-sm focus:outline-none bg-transparent cursor-pointer">
            {Array.from({length: property.max_guests}, (_,i) => i+1).map(n => (
              <option key={n} value={n}>{n} guest{n>1?"s":""}</option>
            ))}
          </select>
        </label>
      </div>

      <Button
        onClick={onReserve}
        disabled={!price?.available || busy}
        variant="gold"
        size="lg"
        className="w-full mt-4"
        loading={busy}
      >
        {property.booking_mode === "INSTANT" ? "Reserve" : "Request to book"}
      </Button>

      {error && <p className="mt-3 text-sm text-red-900">{error}</p>}
      {!error && (
        <p className="mt-3 text-[11px] text-stone text-center">You won't be charged yet</p>
      )}

      {price && price.available && (
        <div className="mt-5 space-y-2 text-sm">
          <Row label={`${formatMoney(price.nightlyMinor, property.currency)} × ${price.nights} nights`} value={formatMoney(price.nightlyMinor * price.nights, property.currency)} />
          <Row label="Cleaning fee" value={formatMoney(price.cleaningMinor, property.currency)} />
          {price.serviceMinor > 0 && <Row label="Service fee" value={formatMoney(price.serviceMinor, property.currency)} />}
          <Row label="Taxes" value={formatMoney(price.taxMinor, property.currency)} />
          <div className="pt-3 border-t border-midnight/10 flex justify-between items-baseline">
            <p className="font-serif text-midnight">Total</p>
            <p className="font-serif text-xl text-midnight">{formatMoney(price.totalMinor, property.currency)}</p>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2 text-[11px] text-stone leading-relaxed">
        <p>· Secure payment via Stripe. No card details stored by NexMansion.</p>
        <p>· Free cancellation within the policy window.</p>
        {property.booking_mode === "REQUEST" && <p>· Host approval required before payment is processed.</p>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-charcoal/70 underline underline-offset-2 decoration-dotted decoration-midnight/30">{label}</span>
      <span className="text-midnight">{value}</span>
    </div>
  );
}
