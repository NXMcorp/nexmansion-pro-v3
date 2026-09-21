import { getPropertyBySlug, getReviewsForProperty } from "@/server/db/properties";
import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/property/PropertyDetail";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPropertyBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} · ${p.region_name || "Bali"}`,
    description: p.tagline || p.overview || p.description.slice(0, 160),
    openGraph: {
      title: p.name,
      description: p.tagline || "",
      images: p.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt || p.name })),
    },
  };
}

export default function VillaPage({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) notFound();
  const reviews = getReviewsForProperty(property.id);
  return (
    <div id="main-content">
      <PropertyDetail property={property} reviews={reviews} />
    </div>
  );
}
