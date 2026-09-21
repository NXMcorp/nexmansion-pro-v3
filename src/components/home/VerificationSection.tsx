import Link from "next/link";
import { BadgeCheck, Eye, FileCheck, Image as ImageIcon, CalendarDays } from "lucide-react";

const standards = [
  { icon: FileCheck, title: "Host identity verified", body: "Government-issued identification and contact details are reviewed before a host can list." },
  { icon: Eye, title: "Property reviewed", body: "Each property is inspected in person or by a trusted local partner before it goes live." },
  { icon: ImageIcon, title: "Imagery inspected", body: "Photographs are reviewed to ensure they are accurate, recent and representative of the home." },
  { icon: CalendarDays, title: "Re-verification", body: "Listings are re-checked regularly, and we act immediately on guest feedback." },
];

export function VerificationSection() {
  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[640px] overflow-hidden bg-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80"
            alt="Calm, elegant villa interior showcasing NexMansion's curated quality"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="label-gold mb-4">The NexMansion Standard</p>
          <h2 className="font-serif text-midnight text-4xl md:text-5xl leading-[1.05] mb-6">
            Trust is designed in.
          </h2>
          <p className="text-charcoal/75 max-w-lg mb-10 leading-relaxed">
            We don't display every villa submitted to us. Every published home passes
            through a multi-stage review covering architecture, condition, amenities,
            privacy, hospitality and service quality. If a home doesn't meet the standard,
            it isn't listed.
          </p>
          <ul className="space-y-6">
            {standards.map((s) => (
              <li key={s.title} className="flex gap-4">
                <s.icon className="h-6 w-6 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-serif text-midnight text-lg mb-1">{s.title}</p>
                  <p className="text-sm text-charcoal/70 leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-gold" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone">
              Nex Verified badge visible on every approved listing
            </p>
          </div>
          <div className="mt-8">
            <Link href="/about" className="btn-outline text-[11px]">About our standards</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
