"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  propertyId,
  initial,
  variant = "dark",
  className,
}: {
  propertyId: string;
  initial?: boolean;
  variant?: "dark" | "light";
  className?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [fav, setFav] = useState(!!initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setFav(!!initial); }, [initial, propertyId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { router.push(`/login?callbackUrl=/villas/${propertyId}`); return; }
    if (busy) return;
    setBusy(true);
    const res = await fetch("/api/favorites", {
      method: fav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    if (res.ok) { setFav(!fav); router.refresh(); }
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={fav}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        variant === "light"
          ? "bg-midnight/30 text-ivory hover:bg-gold hover:text-midnight"
          : "bg-white/90 text-midnight hover:bg-gold hover:text-midnight",
        fav && "bg-gold text-midnight",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", fav && "fill-current")} />
    </button>
  );
}
