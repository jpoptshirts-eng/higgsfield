import gsap from "gsap";

/**
 * RAF-smoothed video.currentTime scrubber.
 * Video stays paused; only currentTime moves toward scroll-driven target.
 */
export function createHeroVideoScrubber(video: HTMLVideoElement) {
  let targetTime = 0;
  let rafId: number | null = null;

  const smoothScrub = () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      rafId = null;
      return;
    }

    const current = video.currentTime;
    const diff = targetTime - current;

    if (Math.abs(diff) > 0.01) {
      video.currentTime = current + diff * 0.16;
      video.pause();
      rafId = requestAnimationFrame(smoothScrub);
    } else {
      video.currentTime = targetTime;
      video.pause();
      rafId = null;
    }
  };

  const setProgress = (progress: number) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    targetTime = gsap.utils.clamp(
      0,
      video.duration - 0.04,
      progress * video.duration,
    );

    if (rafId === null) {
      rafId = requestAnimationFrame(smoothScrub);
    }
  };

  const destroy = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return { setProgress, destroy };
}
