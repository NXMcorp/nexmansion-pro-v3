import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  "Private airport transfers",
  "In-villa private chefs",
  "Chauffeured drivers",
  "Balinese massage & spa",
  "Daily housekeeping",
  "Grocery pre-stocking",
  "Restaurant reservations",
  "Curated experiences",
  "Celebration preparation",
];

export function ConciergeSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-midnight/75" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10 text-ivory">
        <div className="max-w-2xl">
          <p className="label-gold mb-4">Concierge</p>
          <h2 className="font-serif text-ivory text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
            More than a villa.
          </h2>
          <p className="text-ivory/80 text-lg leading-relaxed mb-8 max-w-xl">
            Every NexMansion stay includes direct access to our concierge team. From the
            moment you book, we help shape every detail of your trip.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 max-w-xl mb-10">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-ivory/90 border-b border-ivory/10 py-2">
                <span className="h-[3px] w-3 bg-gold" />
                {s}
              </li>
            ))}
          </ul>
          <Link href="/concierge" className="btn-gold">
            Plan my stay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
