"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useCallback } from "react";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80",
];

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackIndex?: number;
};

export function SafeImage({ src, alt, fallbackIndex = 0, onError, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failedFallbacks, setFailedFallbacks] = useState<number>(0);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Try next fallback
      if (failedFallbacks < FALLBACKS.length) {
        const next = FALLBACKS[failedFallbacks];
        // Avoid infinite loop if current is already fallback
        if (currentSrc !== next) {
          setCurrentSrc(next);
          setFailedFallbacks((c) => c + 1);
          return;
        }
        setFailedFallbacks((c) => c + 1);
        if (failedFallbacks + 1 < FALLBACKS.length) {
          setCurrentSrc(FALLBACKS[failedFallbacks + 1]);
          return;
        }
      }
      // All fallbacks failed, show placeholder
      setHasError(true);
      onError?.(e as any);
    },
    [currentSrc, failedFallbacks, onError]
  );

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-sand text-stone ${props.className || ""}`}
        style={
          props.fill
            ? { position: "absolute", inset: 0 }
            : undefined
        }
        aria-label={alt}
      >
        <div className="text-center p-4">
          <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-midnight/10" />
          <p className="text-[10px] uppercase tracking-[0.2em]">Image unavailable</p>
        </div>
      </div>
    );
  }

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
}

// For non-Next Image (plain img tags) – e.g., collection hero
export function SafeImg({
  src,
  alt,
  className,
  fallbackIndex = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackIndex?: number;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(0);

  const handleError = () => {
    if (failed < FALLBACKS.length) {
      setCurrentSrc(FALLBACKS[failed]);
      setFailed((c) => c + 1);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={currentSrc} alt={alt} className={className} onError={handleError} />
  );
}
