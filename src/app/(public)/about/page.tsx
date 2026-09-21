import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-5 md:px-10 editorial">
        <p className="label-gold mb-4">About NexMansion</p>
        <h1 className="font-serif text-4xl md:text-6xl text-midnight mb-8 leading-[1.05]">Ten extraordinary homes are worth more than ten thousand.</h1>
        <p className="text-lg text-charcoal/80 leading-relaxed mb-8">
          NexMansion is a curated collection of exceptional private homes. We do not list everything — we select.
          Each property is personally reviewed, verified and photographed before it appears on the platform.
        </p>
        <p>
          Our launch collection is ten villas in Bali, chosen for architecture, setting, service and the quality of the stay they provide.
          We expand to new destinations only when we have homes that meet our standard — never before.
        </p>
        <h2>Our standard</h2>
        <p>
          Every NexMansion home is reviewed against criteria covering architectural quality, condition, location, amenities,
          privacy, hospitality, service and accuracy of listing. Hosts and managers are identity-verified,
          properties are inspected, imagery is reviewed and listings are re-checked regularly.
        </p>
        <h2>Curated. Trusted. Human.</h2>
        <p>
          We are not a marketplace for millions. We are a hospitality company that happens to run on technology.
          Every booking is supported by a real concierge team reachable before, during and after your stay.
        </p>
        <div className="mt-10 flex gap-3">
          <Link href="/collections/bali" className="btn-gold text-[11px]">Explore Bali</Link>
          <Link href="/contact" className="btn-outline text-[11px]">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
