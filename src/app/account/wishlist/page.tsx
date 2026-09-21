import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AccountShell } from "@/components/account/AccountShell";
import db from "@/server/db";
import { PropertyCard } from "@/components/property/PropertyCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const favs = db.prepare(`
    SELECT p.*, r.name AS region_name, r.slug AS region_slug, d.name AS destination_name,
      (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.property_id=p.id AND rv.approved=1) AS average_rating,
      (SELECT COUNT(rv.id) FROM reviews rv WHERE rv.property_id=p.id AND rv.approved=1) AS review_count
    FROM favorites f JOIN properties p ON p.id=f.property_id
    LEFT JOIN regions r ON r.id=p.region_id
    LEFT JOIN destinations d ON d.id=p.destination_id
    WHERE f.user_id=? AND p.status='PUBLISHED'
  `).all(session.user.id) as any[];
  return (
    <AccountShell active="wishlist">
      <p className="label-gold mb-4">Wishlist</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Saved villas</h1>
      {favs.length === 0 ? (
        <div className="border border-midnight/10 bg-white p-10 text-center">
          <p className="text-charcoal/70 mb-4">No saved villas yet.</p>
          <Link href="/collections/bali" className="btn-gold text-[11px]">Browse Bali</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {favs.map(p => <PropertyCard key={p.id} property={p} isFavorite />)}
        </div>
      )}
    </AccountShell>
  );
}
