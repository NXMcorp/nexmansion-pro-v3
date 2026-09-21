import Link from "next/link";

export const metadata = { title: "Help" };

const faqs = [
  { q: "How does NexMansion curate its villas?", a: "Every home is visited or assessed by a member of our team before listing. We evaluate architecture, condition, location, amenities, privacy, service quality and listing accuracy." },
  { q: "Is my payment secure?", a: "Payments are processed by Stripe. NexMansion never stores card details on our servers." },
  { q: "What is the difference between instant book and request to book?", a: "Instant book properties can be confirmed immediately. Request to book properties require host approval before payment is processed." },
  { q: "What is the cancellation policy?", a: "Each villa shows its cancellation policy on the listing page. Typical policies are flexible (full refund 7 days before), moderate (50% within 7 days) or strict." },
  { q: "Can I add services after booking?", a: "Yes — your concierge can add airport transfers, chefs, drivers and other services up to 72 hours before arrival." },
  { q: "How do I reach someone during my stay?", a: "Every guest receives a direct contact for their villa manager and the NexMansion concierge before arrival." },
];

export default function HelpPage() {
  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="label-gold mb-4">Help</p>
        <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-8">Frequently asked questions</h1>
        <div className="divide-y divide-midnight/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer text-lg font-serif text-midnight list-none flex justify-between items-center">
                <span>{f.q}</span>
                <span className="text-gold transition-transform group-open:rotate-45 text-xl">+</span>
              </summary>
              <p className="text-charcoal/80 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="text-sm text-stone mt-10">Can't find what you're looking for? <Link href="/contact" className="text-gold underline">Contact us</Link>.</p>
      </div>
    </div>
  );
}
