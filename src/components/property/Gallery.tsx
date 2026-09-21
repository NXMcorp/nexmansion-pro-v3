"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  onOpen,
}: {
  images: PropertyImage[];
  onOpen: (index: number) => void;
}) {
  if (!images.length) {
    return <div className="aspect-[16/9] bg-sand skeleton" />;
  }
  const [hero, ...rest] = images;
  const grid = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-4 gap-2 h-[240px] md:h-[520px]">
      <button
        onClick={() => onOpen(0)}
        className="col-span-4 md:col-span-2 relative overflow-hidden bg-sand group"
        aria-label="Open image gallery"
      >
        <Image src={hero.url} alt={hero.alt || "Property"} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </button>
      {grid.map((img, i) => (
        <button key={img.id} onClick={() => onOpen(i + 1)} className={cn(
          "relative overflow-hidden bg-sand group",
          i === 3 ? "hidden md:block" : "hidden md:block",
          i >= 2 ? "" : ""
        )} aria-label={`View image ${i + 2}`}>
          <Image src={img.url} alt={img.alt || ""} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          {i === 3 && rest.length > 4 ? (
            <div className="absolute inset-0 bg-midnight/50 flex items-center justify-center text-ivory text-[11px] tracking-[0.3em] uppercase">
              +{rest.length - 4} more
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: PropertyImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const prev = useCallback(() => onNavigate((index - 1 + images.length) % images.length), [index, images.length, onNavigate]);
  const next = useCallback(() => onNavigate((index + 1) % images.length), [index, images.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const img = images[index];
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] bg-midnight/95 animate-fade-in">
      <button onClick={onClose} className="absolute top-5 right-5 text-ivory hover:text-gold" aria-label="Close">
        <X className="h-7 w-7" />
      </button>
      <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 text-ivory hover:text-gold" aria-label="Previous image">
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 text-ivory hover:text-gold" aria-label="Next image">
        <ChevronRight className="h-8 w-8" />
      </button>
      <div className="h-full w-full flex items-center justify-center p-4 md:p-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.url} alt={img.alt || ""} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="absolute bottom-5 left-0 right-0 text-center text-ivory/70 text-[11px] tracking-[0.3em] uppercase">
        {index + 1} / {images.length} {img.caption ? `— ${img.caption}` : ""}
      </div>
    </div>
  );
}

Gallery.Lightbox = Lightbox;
