import { Suspense } from "react";
import { CollectionView } from "@/components/collection/CollectionView";

export const metadata = {
  title: "The Bali Collection",
  description: "Ten handpicked luxury villas across Uluwatu, Ubud, Canggu, Seminyak and Nusa Dua — curated and verified by NexMansion.",
};

export default function BaliCollectionPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <div id="main-content">
      <Suspense fallback={<div className="h-[60vh] skeleton" />}>
        <CollectionView slug="bali" searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
