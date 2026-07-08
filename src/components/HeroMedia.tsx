"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const HERO_PORTRAITS = [
  {
    src: "/images/portraits/side-profile.png",
    alt: "Jacinto De Matos side profile portrait",
    position: "object-right-center" as const,
  },
  {
    src: "/images/portraits/diagonal.png",
    alt: "Jacinto De Matos diagonal portrait",
    position: "object-center" as const,
  },
  {
    src: "/images/portraits/front-facing.png",
    alt: "Jacinto De Matos front-facing portrait",
    position: "object-center" as const,
  },
] as const;

export const HERO_VIDEO_SRC = "/media/hero/jacinto-hero-rotation.mp4";

type HeroMediaProps = {
  className?: string;
  /** Desktop scroll-scrub video; false on mobile / reduced-motion */
  useVideoScrub?: boolean;
};

/**
 * Portrait-only hero media.
 * Desktop: scroll-scrubbed video (paused, never autoplays).
 * Fallback: static portrait crossfade on mobile, reduced-motion, or load error.
 */
export function HeroMedia({
  className = "",
  useVideoScrub = false,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = useVideoScrub && !videoFailed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    // Keep paused — scrub only via ScrollTrigger
    const keepPaused = () => {
      if (!video.paused) video.pause();
    };

    video.pause();
    video.addEventListener("play", keepPaused);
    video.addEventListener("loadeddata", keepPaused);

    return () => {
      video.removeEventListener("play", keepPaused);
      video.removeEventListener("loadeddata", keepPaused);
    };
  }, [showVideo]);

  return (
    <div
      data-hero-media
      className={`relative h-full w-full overflow-hidden bg-black ${className}`}
    >
      {/* Scroll-scrub video — desktop only */}
      <video
        ref={videoRef}
        data-hero-video
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
          showVideo ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        src={HERO_VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        aria-hidden={!showVideo}
        aria-label="Jacinto De Matos portrait"
        onError={() => {
          setVideoFailed(true);
          videoRef.current?.setAttribute("data-failed", "true");
        }}
      />

      {/* Portrait fallback — mobile, reduced-motion, or video error */}
      {HERO_PORTRAITS.map((portrait, index) => (
        <div
          key={portrait.src}
          data-hero-image={index === 2 ? "front" : index}
          className={`absolute inset-0 transition-opacity duration-300 ${
            showVideo ? "pointer-events-none opacity-0" : ""
          }`}
          style={{ opacity: showVideo ? 0 : index === 0 ? 1 : 0 }}
          aria-hidden={showVideo}
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-contain ${portrait.position}`}
          />
        </div>
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/80 md:to-black/55"
      />
    </div>
  );
}
