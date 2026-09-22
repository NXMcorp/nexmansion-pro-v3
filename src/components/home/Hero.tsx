"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { SafeImg } from "@/components/ui/SafeImage";

export function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("bali");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", String(guests));
    params.set("destination", destination);
    router.push(`/collections/bali?${params.toString()}`);
  };

  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0">
        <SafeImg
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2400&q=80"
          alt="Luxury cliffside villa in Bali at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/20 to-midnight/80" />
      </div>

      <div className="relative h-full mx-auto max-w-[1500px] px-5 md:px-10 flex flex-col">
        <div className="pt-32 md:pt-40 animate-fade-up">
          <p className="text-gold text-[11px] tracking-[0.5em] uppercase mb-6">NexMansion</p>
          <h1 className="font-serif text-ivory text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl">
            Exceptional homes.<br />
            <span className="italic font-light text-gold-light">Curated stays.</span>
          </h1>
          <p className="mt-6 text-ivory/85 max-w-xl text-base md:text-lg leading-relaxed font-light">
            Discover a private collection of extraordinary villas selected for unforgettable stays.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/collections/bali" className="btn-gold">
              Explore Bali <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/concierge"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-ivory border border-ivory/40 text-sm tracking-[0.3em] uppercase hover:bg-ivory hover:text-midnight transition-colors"
            >
              Speak with our concierge
            </Link>
          </div>
        </div>

        {/* Search module */}
        <form
          onSubmit={onSubmit}
          className="mt-auto mb-8 md:mb-12 bg-ivory/95 backdrop-blur-sm shadow-luxe p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 md:gap-0"
        >
          <Field icon={<MapPin className="h-4 w-4 text-gold" />} label="Destination">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent border-r-0 md:border-r border-midnight/10 px-0 py-2 text-sm font-medium text-midnight focus:outline-none appearance-none cursor-pointer"
              aria-label="Destination"
            >
              <option value="bali">Bali, Indonesia</option>
              <option value="" disabled>Dubai — coming soon</option>
              <option value="" disabled>French Riviera — coming soon</option>
              <option value="" disabled>Mykonos — coming soon</option>
            </select>
          </Field>
          <Field icon={<Calendar className="h-4 w-4 text-gold" />} label="Check-in">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent md:border-r border-midnight/10 px-0 md:px-4 py-2 text-sm text-midnight focus:outline-none"
              aria-label="Check-in"
            />
          </Field>
          <Field icon={<Calendar className="h-4 w-4 text-gold" />} label="Check-out">
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent md:border-r border-midnight/10 px-0 md:px-4 py-2 text-sm text-midnight focus:outline-none"
              aria-label="Check-out"
            />
          </Field>
          <Field icon={<Users className="h-4 w-4 text-gold" />} label="Guests">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-transparent px-0 md:px-4 py-2 text-sm font-medium text-midnight focus:outline-none appearance-none cursor-pointer"
              aria-label="Guests"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>{g} guest{g > 1 ? "s" : ""}</option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto h-[50px] px-6 bg-midnight text-ivory hover:bg-gold hover:text-midnight transition-colors inline-flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase"
              aria-label="Search"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="pt-6">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}
