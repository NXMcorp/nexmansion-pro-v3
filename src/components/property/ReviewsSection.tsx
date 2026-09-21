"use client";

import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function ReviewsSection({ propertyId, reviews }: { propertyId: string; reviews: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const avg = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;
  const breakdown = [5,4,3,2,1].map(r => ({
    stars: r,
    count: reviews.filter((x: any) => x.rating === r).length,
    pct: reviews.length ? (reviews.filter((x: any) => x.rating === r).length / reviews.length) * 100 : 0,
  }));

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push(`/login?callbackUrl=/villas/${propertyId}`); return; }
    setBusy(true);
    const res = await fetch(`/api/properties/${propertyId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title, body }),
    });
    if (res.ok) { setBody(""); setTitle(""); router.refresh(); }
    setBusy(false);
  };

  return (
    <div className="py-10 border-t border-midnight/10">
      <p className="label-gold mb-6">Reviews</p>
      {reviews.length === 0 ? (
        <p className="text-charcoal/70 text-sm">This home is new to NexMansion. Reviews will appear after guests complete verified stays.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
          <div>
            <p className="font-serif text-5xl text-midnight">{avg.toFixed(1)}</p>
            <div className="flex items-center gap-1 mt-2 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className={i <= Math.round(avg) ? "h-4 w-4 fill-gold stroke-gold" : "h-4 w-4 text-stone/40"} />)}
            </div>
            <p className="text-sm text-stone uppercase tracking-widest">{reviews.length} reviews</p>
            <div className="mt-6 space-y-2">
              {breakdown.map(b => (
                <div key={b.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-stone">{b.stars}★</span>
                  <div className="flex-1 h-[2px] bg-midnight/10 relative">
                    <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-stone">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-midnight/10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-midnight text-ivory rounded-full flex items-center justify-center text-sm font-serif">
                    {(r.author_first_name || "G")[0]}{(r.author_last_name || "")[0] || ""}
                  </div>
                  <div>
                    <p className="text-sm text-midnight">{r.author_first_name} {r.author_last_name?.slice(0,1)}.</p>
                    <p className="text-[11px] text-stone uppercase tracking-widest">{formatDate(r.created_at)}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className={i <= r.rating ? "h-3 w-3 fill-gold stroke-gold" : "h-3 w-3 text-stone/40"} />)}
                  </div>
                </div>
                {r.title && <p className="font-serif text-lg text-midnight mb-1">{r.title}</p>}
                <p className="text-sm text-charcoal/80 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {session && (
        <form onSubmit={submitReview} className="mt-10 border-t border-midnight/10 pt-8 space-y-4">
          <p className="label">Leave a review</p>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <button key={i} type="button" onClick={()=>setRating(i)} aria-label={`${i} stars`}>
                <Star className={i <= rating ? "h-6 w-6 fill-gold stroke-gold" : "h-6 w-6 text-stone/40"} />
              </button>
            ))}
          </div>
          <input className="w-full border-b border-midnight/20 px-0 py-2 text-sm focus:outline-none focus:border-gold" placeholder="Title (optional)" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea className="w-full border border-midnight/20 p-3 text-sm focus:outline-none focus:border-gold resize-none h-24" placeholder="Share your experience…" value={body} onChange={(e)=>setBody(e.target.value)} required />
          <Button type="submit" size="sm" loading={busy}>Submit review</Button>
        </form>
      )}
    </div>
  );
}
