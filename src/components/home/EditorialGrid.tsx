import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { formatMoneyMajor } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function EditorialGrid({ properties }: { properties: Property[] }) {
  // First card large, second medium, then standard grid
  const [first, second, ...rest] = properties;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {first && <EditorialCard property={first} size="large" priority />}
      {second && <EditorialCard property={second} size="medium" />}
      {rest.map((p, i) => (
        <EditorialCard key={p.id} property={p} />
      ))}
    </div>
  );
}

function EditorialCard({ property, size = "standard", priority = false }: { property: Property; size?: "large" | "medium" | "standard"; priority?: boolean }) {
  const major = property.base_price_minor / 100;
  return (
    <Link
      href={`/villas/${property.slug}`}
      className={cn(
        "group block relative",
        size === "large" ? "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-[16/11]" : "aspect-[4/5]",
      )}
    >
      <div className="relative h-full w-full overflow-hidden bg-sand">
        <Image
          src={property.hero_image_url || ""}
          alt={property.name}
          fill
          priority={priority}
          sizes={size === "large" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/10 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="gold">Nex Verified</Badge>
          {property.featured ? <Badge variant="light">Featured</Badge> : null}
        </div>
        <div className="absolute top-4 right-4">
          <FavoriteButton propertyId={property.id} variant="light" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-ivory">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold-light mb-2">
            {property.region_name || property.destination_name}
          </p>
          <h3 className={cn("font-serif text-ivory", size === "large" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl")}>
            {property.name}
          </h3>
          {property.tagline && size === "large" && (
            <p className="mt-2 text-ivory/80 text-sm max-w-xl line-clamp-2">{property.tagline}</p>
          )}
          <div className="mt-4 flex items-center justify-between text-[12px] tracking-wider uppercase">
            <div className="flex items-center gap-4 text-ivory/80">
              <span>{property.bedrooms} bd</span>
              <span>·</span>
              <span>{property.max_guests} guests</span>
              {property.average_rating && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-gold stroke-gold" />
                    {Number(property.average_rating).toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <div className="text-ivory">
              <span className="text-lg font-serif">{formatMoneyMajor(major, property.currency)}</span>
              <span className="text-[10px] text-ivory/60 tracking-widest uppercase ml-1">/ night</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
