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
 * Portrait-only hero media — stable container, no opacity/filter on video.
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

    const keepPaused = () => {
      if (!video.paused) video.pause();
    };

    video.pause();
    video.addEventListener("play", keepPaused);

    return () => {
      video.removeEventListener("play", keepPaused);
    };
  }, [showVideo]);

  return (
    <div
      data-hero-media
      className={`hero-media ${className}`}
    >
      <video
        ref={videoRef}
        data-hero-video
        className={`hero-video ${showVideo ? "" : "hero-video--hidden"}`}
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
          className="hero-portrait-layer"
          style={{
            opacity: showVideo ? 0 : index === 0 ? 1 : 0,
            pointerEvents: "none",
          }}
          aria-hidden={showVideo}
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 52vw"
            className={`object-contain ${portrait.position}`}
          />
        </div>
      ))}

      <div aria-hidden className="hero-media-gradient" />
    </div>
  );
}
