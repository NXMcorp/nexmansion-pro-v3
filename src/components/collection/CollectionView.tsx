import Link from "next/link";
import Image from "next/image";
import { getCollectionBySlug, getPublishedProperties, getRegionsForDestination, getAmenityCategories } from "@/server/db/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FiltersBar } from "@/components/collection/FiltersBar";
import { notFound } from "next/navigation";

export function CollectionView({ slug, searchParams }: { slug: string; searchParams: Record<string, string | undefined> }) {
  const collection = getCollectionBySlug(slug);
  if (!collection || collection.coming_soon) notFound();

  const filters = {
    collectionSlug: slug,
    regionSlug: searchParams.region,
    minGuests: searchParams.guests ? Number(searchParams.guests) : undefined,
    minBedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    maxPriceMinor: searchParams.maxPrice ? Number(searchParams.maxPrice) * 100 : undefined,
    beachfront: searchParams.beachfront === "1",
    oceanView: searchParams.oceanView === "1",
    jungleView: searchParams.jungleView === "1",
    pool: searchParams.pool === "1",
    amenities: searchParams.amenities ? searchParams.amenities.split(",").filter(Boolean) : undefined,
    search: searchParams.q,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
  };

  const properties = getPublishedProperties(filters);
  const regions = getRegionsForDestination("bali");
  const amenityGroups = getAmenityCategories();

  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.hero_image_url || ""}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/20 to-midnight/80" />
        </div>
        <div className="relative h-full mx-auto max-w-[1500px] px-5 md:px-10 flex items-end pb-12 md:pb-16">
          <div className="text-ivory max-w-3xl animate-fade-up">
            <p className="label-gold mb-4">{collection.subtitle}</p>
            <h1 className="font-serif text-ivory text-5xl md:text-7xl leading-[1.02]">{collection.title}</h1>
            <p className="text-ivory/80 text-lg mt-5 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
            <div className="mt-6 flex items-center gap-6 text-[11px] tracking-[0.3em] uppercase text-ivory/70">
              <span>{properties.length} villas available</span>
              <span className="h-px w-10 bg-gold" />
              <span>Bali, Indonesia</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 md:px-10 py-12">
        <FiltersBar regions={regions} amenityGroups={amenityGroups} searchParams={searchParams} />

        <div className="mt-8 flex items-baseline justify-between mb-6">
          <p className="text-sm text-stone tracking-widest uppercase">
            Showing <span className="text-midnight font-medium">{properties.length}</span> {properties.length === 1 ? "villa" : "villas"}
          </p>
          <Link href="/concierge" className="text-[11px] tracking-[0.25em] uppercase text-gold hover:text-midnight transition-colors">
            Can't find what you're looking for?
          </Link>
        </div>

        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center border border-midnight/10 bg-white">
      <p className="label-gold mb-4">No villas match exactly</p>
      <h3 className="font-serif text-3xl mb-4">No availability for these dates.</h3>
      <p className="text-charcoal/70 max-w-md mx-auto mb-8 leading-relaxed">
        Try adjusting dates or removing a filter, or speak with our concierge — we often know of stays not yet visible online.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/collections/bali" className="btn-outline text-[11px]">Clear filters</Link>
        <Link href="/concierge" className="btn-gold text-[11px]">Contact concierge</Link>
      </div>
    </div>
  );
}
