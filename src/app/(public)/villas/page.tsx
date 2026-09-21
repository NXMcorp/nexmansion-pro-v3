import Link from "next/link";
import { getPublishedProperties } from "@/server/db/properties";
import { PropertyCard } from "@/components/property/PropertyCard";

export const metadata = { title: "Luxury Villas", description: "All NexMansion curated luxury villas." };

export default function VillasPage() {
  const villas = getPublishedProperties();
  return (
    <div id="main-content" className="pt-28 pb-20">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="label-gold mb-4">Curated collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-midnight mb-10">All villas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    </div>
  );
}
