"use client";

import Image from "next/image";

type PortraitPanelProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
};

/**
 * Right-column portrait container — image only, no baked-in UI.
 */
export function PortraitPanel({
  src,
  alt,
  className = "",
  priority = false,
  objectPosition = "object-center",
}: PortraitPanelProps) {
  return (
    <div
      className={`relative h-full min-h-[42vh] w-full overflow-hidden bg-black md:min-h-0 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-contain ${objectPosition}`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/70 md:to-black/45"
      />
    </div>
  );
}
