"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { Gallery } from "@/components/property/Gallery";
import { TrustPanel } from "@/components/property/TrustPanel";
import { ReviewsSection } from "@/components/property/ReviewsSection";
import { Share2, MapPin, Bed, Bath, Users, Maximize, Check, Star, ArrowLeft } from "lucide-react";
import type { PropertyWithJoins } from "@/server/db/properties";
import { formatMoneyMajor } from "@/lib/money";

export function PropertyDetail({ property, reviews }: { property: PropertyWithJoins; reviews: any[] }) {
  const { data: session } = useSession();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const categories = property.amenities.reduce<Record<string, typeof property.amenities>>((acc, a) => {
    (acc[a.category] = acc[a.category] || []).push(a);
    return acc;
  }, {});

  const sections = (property.description || "").split("\n\n").filter(Boolean);

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: property.name, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : null;

  return (
    <>
      <div className="pt-20 md:pt-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Link href="/collections/bali" className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-stone hover:text-midnight mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to Bali Collection
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <Badge variant="gold">Nex Verified</Badge>
                {property.featured ? <Badge variant="dark">Featured</Badge> : null}
                {property.booking_mode === "INSTANT" ? (
                  <Badge variant="outline">Instant book</Badge>
                ) : (
                  <Badge variant="outline">Request to book</Badge>
                )}
              </div>
              <h1 className="font-serif text-midnight text-4xl md:text-6xl leading-[1.05]">{property.name}</h1>
              <div className="flex items-center gap-3 flex-wrap mt-3 text-sm text-charcoal/70">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{property.region_name}, {property.destination_name}</span>
                {avgRating ? (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold stroke-gold" /> {avgRating.toFixed(1)}
                      <span className="text-stone">· {reviews.length} reviews</span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={share} className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-midnight/70 hover:text-gold">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <FavoriteButton propertyId={property.id} variant="dark" />
            </div>
          </div>

          <Gallery
            images={property.images}
            onOpen={(i) => { setGalleryIndex(i); setGalleryOpen(true); }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 mt-12 lg:mt-16">
            <div>
              {/* Quick facts */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-8 border-b border-midnight/10">
                <Fact icon={<Users className="h-5 w-5 text-gold" />} label="Guests" value={`Up to ${property.max_guests}`} />
                <Fact icon={<Bed className="h-5 w-5 text-gold" />} label="Bedrooms" value={String(property.bedrooms)} />
                <Fact icon={<Bath className="h-5 w-5 text-gold" />} label="Bathrooms" value={String(property.bathrooms)} />
                {property.size_sqm ? <Fact icon={<Maximize className="h-5 w-5 text-gold" />} label="Size" value={`${property.size_sqm} m²`} /> : null}
                <Fact icon={<Bed className="h-5 w-5 text-gold" />} label="Check-in" value={property.check_in_time} />
              </div>

              {/* Story */}
              <div className="py-10 editorial">
                {property.overview ? <p className="text-lg md:text-xl font-serif text-midnight leading-relaxed mb-6">{property.overview}</p> : null}
                {sections.map((s, i) => {
                  const [title, ...rest] = s.split(" — ");
                  if (rest.length === 0) {
                    return <p key={i}>{s}</p>;
                  }
                  return (
                    <div key={i} className="mb-8">
                      <h3 className="text-2xl mb-2">{title}</h3>
                      <p>{rest.join(" — ")}</p>
                    </div>
                  );
                })}
              </div>

              {/* Amenities */}
              <div className="py-10 border-t border-midnight/10">
                <p className="label-gold mb-6">Amenities</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {Object.entries(categories).map(([cat, list]) => (
                    <div key={cat}>
                      <p className="label mb-3 capitalize">{cat.replace("-", " ")}</p>
                      <ul className="space-y-2">
                        {list.map((a) => (
                          <li key={a.id} className="flex items-center gap-3 text-sm text-charcoal">
                            <Check className="h-4 w-4 text-gold" />
                            {a.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* House rules */}
              <div className="py-10 border-t border-midnight/10">
                <p className="label-gold mb-6">House rules</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.rules.map((r) => (
                    <li key={r.id} className="flex gap-3 items-start">
                      <Check className="h-4 w-4 text-gold mt-1" />
                      <span className="text-sm text-charcoal">{r.title}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-6 text-sm text-charcoal/80">
                  <span>Check-in: <b className="text-midnight">{property.check_in_time}</b></span>
                  <span>Check-out: <b className="text-midnight">{property.check_out_time}</b></span>
                  <span>Cancellation: <b className="text-midnight capitalize">{property.cancellation_policy}</b></span>
                </div>
              </div>

              <TrustPanel verification={property.verification} />
              <ReviewsSection propertyId={property.id} reviews={reviews} />
            </div>

            {/* Sticky booking panel */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <BookingPanel property={property} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile booking bar */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-ivory border-t border-midnight/10 p-4 flex items-center gap-3">
        <div>
          <p className="font-serif text-xl text-midnight">{formatMoneyMajor(property.base_price_minor / 100, property.currency)}</p>
          <p className="text-[10px] uppercase tracking-widest text-stone">per night</p>
        </div>
        <Link href={`/book/${property.slug}`} className="btn-gold flex-1 text-[11px]">
          {property.booking_mode === "INSTANT" ? "Reserve" : "Request to book"}
        </Link>
      </div>

      {galleryOpen && (
        <Gallery.Lightbox
          images={property.images}
          index={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          onNavigate={setGalleryIndex}
        />
      )}
    </>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      {icon}
      <p className="label">{label}</p>
      <p className="text-sm text-midnight">{value}</p>
    </div>
  );
}
