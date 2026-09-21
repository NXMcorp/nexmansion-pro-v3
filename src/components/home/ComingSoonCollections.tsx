import Link from "next/link";
import { Lock } from "lucide-react";

interface Collection {
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image_url: string | null;
  destination_name: string;
}

export function ComingSoonCollections({ collections }: { collections: Collection[] }) {
  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="label-gold mb-4">Global collection</p>
          <h2 className="font-serif text-midnight text-4xl md:text-5xl leading-[1.05]">
            Future destinations.
          </h2>
          <p className="text-charcoal/70 mt-4 leading-relaxed">
            We are quietly curating future collections in the world's most extraordinary destinations.
            We will open a destination only when its homes meet our standards — never before.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
          {collections.map((c) => (
            <div key={c.slug} className="group relative aspect-[3/4] overflow-hidden bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.hero_image_url || ""}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-midnight/50" />
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-ivory">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-light mb-2">
                  <Lock className="h-3 w-3" /> Coming soon
                </span>
                <h3 className="font-serif text-ivory text-xl md:text-2xl leading-tight">{c.destination_name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-sm text-stone">
          These destinations are shown as future plans only. No availability is implied.{" "}
          <Link href="/contact" className="text-gold underline underline-offset-4">Notify me</Link>.
        </div>
      </div>
    </section>
  );
}
