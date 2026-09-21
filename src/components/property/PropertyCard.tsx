import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { formatMoneyMajor } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { Star } from "lucide-react";

export function PropertyCard({ property, isFavorite }: { property: Property; isFavorite?: boolean }) {
  return (
    <Link href={`/villas/${property.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand mb-4">
        <Image
          src={property.hero_image_url || ""}
          alt={property.name}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="gold">Nex Verified</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton propertyId={property.id} initial={!!isFavorite} variant="light" />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone">{property.region_name}</p>
          <h3 className="font-serif text-xl md:text-2xl text-midnight mt-1 group-hover:text-gold transition-colors">
            {property.name}
          </h3>
          <p className="text-sm text-charcoal/70 mt-1">
            {property.bedrooms} bd · {property.max_guests} guests
            {property.average_rating ? (
              <>
                <span className="mx-2 text-midnight/20">|</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold stroke-gold" />
                  {Number(property.average_rating).toFixed(1)}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-serif text-xl text-midnight">{formatMoneyMajor(property.base_price_minor / 100, property.currency)}</p>
          <p className="text-[10px] uppercase tracking-widest text-stone">per night</p>
        </div>
      </div>
    </Link>
  );
}
