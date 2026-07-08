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

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const imageRatio = iw / ih;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (imageRatio > canvasRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imageRatio;
  } else {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imageRatio;
  }

  const x = canvasWidth - drawWidth;
  const y = (canvasHeight - drawHeight) / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, drawWidth, drawHeight);
}

export const HeroFrameSequence = forwardRef<
  HeroFrameSequenceHandle,
  HeroFrameSequenceProps
>(function HeroFrameSequence({ enabled }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef({ width: 0, height: 0 });
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetFrameRef = useRef(10);
  const displayedFrameRef = useRef(10);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const readyRef = useRef(false);
  const failedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const paint = (frameNumber: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current.get(frameNumber);
    if (!canvas || !img?.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = layoutRef.current;
    drawImageContain(ctx, img, width, height);
    displayedFrameRef.current = frameNumber;
  };

  const tick = () => {
    if (!readyRef.current || failedRef.current) {
      rafRef.current = null;
      return;
    }

    const target = targetFrameRef.current;
    if (displayedFrameRef.current !== target) paint(target);

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
    layoutRef.current = { width, height };
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
      if (!readyRef.current || failedRef.current) return;

      const next = progressToFrameNumber(progress);
      if (next === targetFrameRef.current) return;
      targetFrameRef.current = next;
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
        readyRef.current = true;
        setReady(true);
        resizeCanvas();
        const startFrame = progressToFrameNumber(progressRef.current);
        targetFrameRef.current = startFrame;
        paint(startFrame);
        // Let the scroll system know sizing is stable.
        window.dispatchEvent(new Event("hero-frames-ready"));
      }
    };

    frames.forEach((frameNumber) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = heroFramePath(frameNumber);
      img.onload = onLoad;
      img.onerror = () => {
        if (cancelled) return;
        failedRef.current = true;
        setFailed(true);
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
              className="object-contain object-right"
            />
          </div>
        ))}
    </div>
  );
});
