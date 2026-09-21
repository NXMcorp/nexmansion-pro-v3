import { CheckCircle2, ShieldCheck, ConciergeBell, CalendarCheck } from "lucide-react";

const pillars = [
  {
    icon: CheckCircle2,
    title: "Curated",
    body: "Every home is personally selected against NexMansion quality standards before it ever appears on the platform.",
  },
  {
    icon: ShieldCheck,
    title: "Verified",
    body: "Owners, managers and property details are reviewed. Imagery is inspected. Listings are only published once verified.",
  },
  {
    icon: ConciergeBell,
    title: "Exceptional service",
    body: "Private concierge support accompanies every stay — from airport transfers to celebration dinners and spa.",
  },
  {
    icon: CalendarCheck,
    title: "Seamless booking",
    body: "Transparent pricing, secure payments and clear cancellation terms. No surprises at check-in.",
  },
];

export function PillarsSection() {
  return (
    <section className="bg-midnight text-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="label-gold mb-4">Why NexMansion</p>
          <h2 className="font-serif text-ivory text-4xl md:text-5xl leading-[1.05]">
            Ten extraordinary homes <br className="hidden md:block" />
            are worth more than ten thousand.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {pillars.map((p) => (
            <div key={p.title} className="border-t border-ivory/10 pt-6">
              <p.icon className="h-7 w-7 text-gold mb-5" />
              <h3 className="font-serif text-ivory text-2xl mb-3">{p.title}</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
