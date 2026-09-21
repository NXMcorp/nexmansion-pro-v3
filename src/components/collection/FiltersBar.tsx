"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function FiltersBar({
  regions,
  amenityGroups,
  searchParams,
}: {
  regions: { slug: string; name: string; property_count: number }[];
  amenityGroups: Record<string, { slug: string; name: string }[]>;
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(searchParams.guests || "");
  const [bedrooms, setBedrooms] = useState(searchParams.bedrooms || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || "");
  const [region, setRegion] = useState(searchParams.region || "");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(searchParams.amenities ? searchParams.amenities.split(",").filter(Boolean) : []),
  );
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    beachfront: searchParams.beachfront === "1",
    oceanView: searchParams.oceanView === "1",
    jungleView: searchParams.jungleView === "1",
    pool: searchParams.pool === "1",
  });

  const apply = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (region) params.set("region", region);
    if (selected.size) params.set("amenities", Array.from(selected).join(","));
    Object.entries(toggles).forEach(([k, v]) => { if (v) params.set(k, "1"); });
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const reset = () => {
    setGuests(""); setBedrooms(""); setMaxPrice(""); setRegion(""); setCheckIn(""); setCheckOut("");
    setSelected(new Set()); setToggles({ beachfront: false, oceanView: false, jungleView: false, pool: false });
    router.push(pathname);
    setOpen(false);
  };

  const activeCount =
    (guests ? 1 : 0) + (bedrooms ? 1 : 0) + (maxPrice ? 1 : 0) + (region ? 1 : 0) +
    selected.size + Object.values(toggles).filter(Boolean).length +
    (checkIn && checkOut ? 1 : 0);

  return (
    <div>
      {/* Quick bar */}
      <div className="flex flex-wrap items-center gap-2 border border-midnight/10 bg-white p-4">
        <Field label="Check-in">
          <input type="date" value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full" />
        </Field>
        <Divider />
        <Field label="Check-out">
          <input type="date" value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full" />
        </Field>
        <Divider />
        <Field label="Guests">
          <select value={guests} onChange={(e)=>setGuests(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full cursor-pointer">
            <option value="">Any</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>{g}+</option>)}
          </select>
        </Field>
        <Divider />
        <Field label="Bedrooms">
          <select value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full cursor-pointer">
            <option value="">Any</option>
            {[1,2,3,4,5,6].map(b => <option key={b} value={b}>{b}+</option>)}
          </select>
        </Field>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.25em] uppercase border border-midnight/20 hover:border-midnight transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" /> More filters
            {activeCount > 0 && <span className="bg-gold text-midnight text-[10px] px-1.5 py-0.5">{activeCount}</span>}
          </button>
          <button onClick={apply} className="inline-flex items-center gap-2 px-4 py-2 bg-midnight text-ivory text-[11px] tracking-[0.25em] uppercase hover:bg-gold hover:text-midnight transition-colors">
            <Search className="h-3.5 w-3.5" /> Search
          </button>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-midnight/50 animate-fade-in" onClick={()=>setOpen(false)}>
          <div onClick={(e)=>e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory shadow-luxe animate-slide-up overflow-y-auto">
            <div className="p-6 flex items-center justify-between border-b border-midnight/10">
              <p className="label-gold">Filters</p>
              <button onClick={()=>setOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <p className="label mb-4">Destination area</p>
                <div className="flex flex-wrap gap-2">
                  <TogglePill active={region===""} onClick={()=>setRegion("")}>All Bali</TogglePill>
                  {regions.map(r => (
                    <TogglePill key={r.slug} active={region===r.slug} onClick={()=>setRegion(r.slug)}>
                      {r.name} <span className="opacity-60 ml-1">({r.property_count})</span>
                    </TogglePill>
                  ))}
                </div>
              </div>

              <div>
                <p className="label mb-4">Maximum nightly rate (EUR)</p>
                <input type="range" min={300} max={3000} step={50} value={maxPrice || 3000} onChange={(e)=>setMaxPrice(e.target.value)} className="w-full" />
                <p className="text-sm mt-2">Up to €{Number(maxPrice || 3000).toLocaleString()}</p>
              </div>

              <div>
                <p className="label mb-4">Features</p>
                <div className="grid grid-cols-2 gap-2">
                  <TogglePill active={!!toggles.beachfront} onClick={()=>setToggles({...toggles, beachfront:!toggles.beachfront})}>Beachfront</TogglePill>
                  <TogglePill active={!!toggles.oceanView} onClick={()=>setToggles({...toggles, oceanView:!toggles.oceanView})}>Ocean view</TogglePill>
                  <TogglePill active={!!toggles.jungleView} onClick={()=>setToggles({...toggles, jungleView:!toggles.jungleView})}>Jungle view</TogglePill>
                  <TogglePill active={!!toggles.pool} onClick={()=>setToggles({...toggles, pool:!toggles.pool})}>Private pool</TogglePill>
                </div>
              </div>

              {Object.entries(amenityGroups).map(([cat, list]) => (
                <div key={cat}>
                  <p className="label mb-3 capitalize">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {list.map(a => (
                      <TogglePill key={a.slug}
                        active={selected.has(a.slug)}
                        onClick={() => {
                          const next = new Set(selected);
                          if (next.has(a.slug)) next.delete(a.slug); else next.add(a.slug);
                          setSelected(next);
                        }}>
                        {a.name}
                      </TogglePill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-ivory border-t border-midnight/10 p-4 flex gap-3">
              <button onClick={reset} className="flex-1 btn-outline text-[11px]">Reset</button>
              <button onClick={apply} className="flex-1 btn-gold text-[11px]">Show villas</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 min-w-[110px]">
      <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-1">{label}</p>
      {children}
    </div>
  );
}
function Divider() { return <div className="hidden md:block h-8 w-px bg-midnight/10" />; }
function TogglePill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors",
      active ? "bg-midnight text-ivory border-midnight" : "border-midnight/20 text-midnight hover:border-midnight",
    )}>{children}</button>
  );
}
