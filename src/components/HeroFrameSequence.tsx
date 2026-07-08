"use client";

import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  getPreloadFrameNumbers,
  heroFramePath,
  progressToFrameNumber,
} from "@/data/heroFrames";
import { HERO_PORTRAITS } from "@/data/heroPortraits";

export type HeroFrameSequenceHandle = {
  setProgress: (progress: number) => void;
};

type HeroFrameSequenceProps = {
  /** Desktop canvas sequence; false uses static portraits */
  enabled: boolean;
};

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const scale = Math.max(width / iw, height / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const x = width - sw;
  const y = (height - sh) / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, x, y, sw, sh);
}

export const HeroFrameSequence = forwardRef<
  HeroFrameSequenceHandle,
  HeroFrameSequenceProps
>(function HeroFrameSequence({ enabled }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetFrameRef = useRef(10);
  const displayedFrameRef = useRef(10);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const paint = (frameNumber: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current.get(frameNumber);
    if (!canvas || !img?.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawCover(ctx, img, canvas.width, canvas.height);
    displayedFrameRef.current = frameNumber;
  };

  const tick = () => {
    const target = targetFrameRef.current;
    const current = displayedFrameRef.current;

    if (current !== target) {
      paint(target);
    }

    rafRef.current = null;
  };

  const schedulePaint = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(tick);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = container.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    paint(displayedFrameRef.current);
  };

  useImperativeHandle(ref, () => ({
    setProgress(progress: number) {
      progressRef.current = progress;
      targetFrameRef.current = progressToFrameNumber(progress);
      schedulePaint();
    },
  }));

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const frames = getPreloadFrameNumbers();
    let loaded = 0;

    const onLoad = () => {
      loaded += 1;
      if (!cancelled && loaded >= frames.length) {
        setReady(true);
        resizeCanvas();
        paint(progressToFrameNumber(progressRef.current));
      }
    };

    frames.forEach((frameNumber) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = heroFramePath(frameNumber);
      img.onload = onLoad;
      img.onerror = () => {
        if (!cancelled) setFailed(true);
      };
      imagesRef.current.set(frameNumber, img);
    });

    return () => {
      cancelled = true;
      imagesRef.current.clear();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready) return;

    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [enabled, ready]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const showCanvas = enabled && ready && !failed;
  const showPortraits = !enabled || failed;

  return (
    <div
      ref={containerRef}
      data-hero-media
      data-hero-frame-sequence
      className="hero-media"
    >
      <canvas
        ref={canvasRef}
        className={showCanvas ? "hero-media-canvas" : "hero-media-canvas hero-media-canvas--hidden"}
        aria-hidden={!showCanvas}
        aria-label="Jacinto De Matos portrait"
      />

      {showPortraits &&
        HERO_PORTRAITS.map((portrait, index) => (
          <div
            key={portrait.src}
            data-hero-image={index === 2 ? "front" : index}
            className="hero-portrait-layer"
            style={{
              opacity: index === 0 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 58vw"
              className={`object-cover object-center ${portrait.position}`}
            />
          </div>
        ))}
    </div>
  );
});
