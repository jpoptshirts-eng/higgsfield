/** Total extracted frames on disk (frame-0001 … frame-0100). */
export const HERO_FRAME_COUNT = 100;

/** Inclusive 1-based range to exclude (back-of-head rotation). */
export const HERO_SKIP_RANGE = { start: 30, end: 58 } as const;

/** Scroll progress → representative frame for each hero state. */
export const HERO_FRAME_KEYPOINTS = [
  { progress: 0, frame: 10 },
  { progress: 0.5, frame: 75 },
  { progress: 1, frame: 98 },
] as const;

export function heroFramePath(frameNumber: number): string {
  return `/media/hero/frames/frame-${String(frameNumber).padStart(4, "0")}.jpg`;
}

export function isSkippedFrame(frameNumber: number): boolean {
  return (
    frameNumber >= HERO_SKIP_RANGE.start &&
    frameNumber <= HERO_SKIP_RANGE.end
  );
}

/** All frames that may be loaded (skips back-of-head range). */
export function getPreloadFrameNumbers(): number[] {
  const frames: number[] = [];
  for (let i = 1; i <= HERO_FRAME_COUNT; i++) {
    if (!isSkippedFrame(i)) frames.push(i);
  }
  return frames;
}

/** Map hero scroll progress (0–1) to a frame number, skipping back-of-head. */
export function progressToFrameNumber(progress: number): number {
  const validFrames = getPreloadFrameNumbers();
  const p = Math.max(0, Math.min(1, progress));
  const points = HERO_FRAME_KEYPOINTS;

  const indexOfFrame = (frame: number) => {
    const idx = validFrames.indexOf(frame);
    return idx >= 0 ? idx : 0;
  };

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (p >= a.progress && p <= b.progress) {
      const span = b.progress - a.progress || 1;
      const t = (p - a.progress) / span;
      const idxA = indexOfFrame(a.frame);
      const idxB = indexOfFrame(b.frame);
      const idx = Math.round(idxA + t * (idxB - idxA));
      return validFrames[Math.max(0, Math.min(validFrames.length - 1, idx))];
    }
  }

  return points[points.length - 1].frame;
}
