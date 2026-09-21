import Link from "next/link";
import Image from "next/image";
import { getPublishedProperties, getComingSoonCollections } from "@/server/db/properties";
import { Hero } from "@/components/home/Hero";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { PillarsSection } from "@/components/home/PillarsSection";
import { VerificationSection } from "@/components/home/VerificationSection";
import { ConciergeSection } from "@/components/home/ConciergeSection";
import { ComingSoonCollections } from "@/components/home/ComingSoonCollections";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const villas = getPublishedProperties({ collectionSlug: "bali" });
  const comingSoon = getComingSoonCollections();
  return (
    <div id="main-content">
      <Hero />
      <section className="mx-auto max-w-[1500px] px-5 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <p className="label-gold mb-4">The Bali Collection</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-[1.05]">
              Ten handpicked private villas.
            </h2>
            <p className="text-charcoal/70 max-w-xl mt-4 text-[15px] leading-relaxed">
              Not hundreds. Not thousands. Ten extraordinary homes in Uluwatu, Ubud, Canggu, Seminyak and Nusa Dua — each personally reviewed by the NexMansion team.
            </p>
          </div>
          <Link href="/collections/bali" className="hidden md:inline-flex btn-outline text-[11px]">
            Explore the collection
          </Link>
        </div>
        <EditorialGrid properties={villas.slice(0, 8)} />
        <div className="mt-10 flex md:hidden">
          <Link href="/collections/bali" className="btn-outline w-full text-[11px]">
            Explore the collection
          </Link>
        </div>
      </section>

      <PillarsSection />
      <VerificationSection />
      <ConciergeSection />
      <ComingSoonCollections collections={comingSoon} />
    </div>
  );
}
