"use client";

import { useState } from "react";
import { placeImages } from "@/data/placeImages";

interface PlaceImageProps {
  slug: string;
  name: string;
  className?: string;
  /** Tailwind gradient classes for the fallback (when no image / on load error). */
  gradient?: string;
  priority?: boolean;
}

// Renders a place's scraped og:image over a gradient fallback. Places without a
// scraped image (~half) show only the gradient — intentional, keeps card heights
// consistent. External URLs can rot/hotlink-block, so onError falls back to the
// gradient rather than a broken-image icon.
export default function PlaceImage({
  slug,
  name,
  className = "",
  gradient = "from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40",
  priority = false,
}: PlaceImageProps) {
  const src = placeImages[slug];
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
