"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { NavId } from "@/data/site";
import { PROJECTS } from "@/data/site";

const HERO_STEP_COUNT = 3;
const WORK_STEP_COUNT = PROJECTS.length;
const TOTAL_STEPS = HERO_STEP_COUNT + WORK_STEP_COUNT;

const STORY_SNAP_INCREMENT = 1 / (TOTAL_STEPS - 1);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function getHeroCopyEls(root: HTMLElement) {
  return {
    first: root.querySelector<HTMLElement>('[data-hero-copy="0"]'),
    second: root.querySelector<HTMLElement>('[data-hero-copy="1"]'),
    metrics: root.querySelector<HTMLElement>('[data-hero-copy="metrics"]'),
  };
}

function scrollToStoryStep(
  step: number,
  behavior: ScrollBehavior = "smooth",
) {
  const storyTrigger =
    ScrollTrigger.getById("story-scrub") ??
    ScrollTrigger.getById("story-scrub-mobile");
  if (!storyTrigger) return;

  const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, step));
  const progress = clamped / (TOTAL_STEPS - 1);
  const target =
    storyTrigger.start +
    (storyTrigger.end - storyTrigger.start) * progress;

  window.scrollTo({ top: target, behavior });
}

export function usePortfolioScroll() {
  const storyRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const [activeSection, setActiveSection] = useState<NavId | "hero">("hero");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useVideoScrub, setUseVideoScrub] = useState(false);

  const handleNavigate = useCallback(
    (id: NavId | "top") => {
      const behavior = reducedMotion ? "auto" : ("smooth" as ScrollBehavior);

      if (id === "top") {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      if (id === "work") {
        scrollToStoryStep(HERO_STEP_COUNT, behavior);
        return;
      }

      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior });
      }
    },
    [reducedMotion],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();
    const mobile = isMobile();
    setReducedMotion(reduced);
    setUseVideoScrub(!reduced && !mobile);

    const story = storyRef.current;
    const pin = story?.querySelector<HTMLElement>("[data-story-pin]");
    if (!story || !pin) return;

    const ctx = gsap.context(() => {
      const heroCopies = getHeroCopyEls(pin);
      const heroImage0 = pin.querySelector<HTMLElement>('[data-hero-image="0"]');
      const heroImage1 = pin.querySelector<HTMLElement>('[data-hero-image="1"]');
      const heroImageFront = pin.querySelector<HTMLElement>(
        '[data-hero-image="front"]',
      );
      const heroMedia = pin.querySelector<HTMLElement>("[data-hero-media]");
      const workPanel = pin.querySelector<HTMLElement>("[data-work-panel]");
      const workMedia = pin.querySelector<HTMLElement>("[data-work-media]");
      const projectTitles = gsap.utils.toArray<HTMLElement>("[data-project-label]");
      const projectDetails = gsap.utils.toArray<HTMLElement>(
        "[data-project-detail]",
      );
      const projectImages = gsap.utils.toArray<HTMLElement>(
        "[data-project-image]",
      );
      const projectDots = gsap.utils.toArray<HTMLElement>("[data-project-dot]");

      const projectTriggers = gsap.utils.toArray<HTMLButtonElement>(
        "[data-project-trigger]",
      );

      const clickHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = [];

      projectTriggers.forEach((trigger, index) => {
        const fn = () => {
          scrollToStoryStep(
            HERO_STEP_COUNT + index,
            reduced ? "auto" : "smooth",
          );
        };
        trigger.addEventListener("click", fn);
        clickHandlers.push({ el: trigger, fn });
      });

      const heroVideo = pin.querySelector<HTMLVideoElement>("[data-hero-video]");

      const isVideoScrubActive = () =>
        !reduced &&
        !mobile &&
        !!heroVideo &&
        !heroVideo.hasAttribute("data-failed") &&
        Number.isFinite(heroVideo.duration) &&
        heroVideo.duration > 0;

      // Ensure video metadata is ready before scrubbing
      let videoCleanup: (() => void) | undefined;
      if (heroVideo && !reduced && !mobile) {
        const onMeta = () => ScrollTrigger.refresh();
        const onError = () => heroVideo.setAttribute("data-failed", "true");
        heroVideo.addEventListener("loadedmetadata", onMeta);
        heroVideo.addEventListener("error", onError);
        if (heroVideo.readyState >= 1) onMeta();
        heroVideo.pause();

        videoCleanup = () => {
          heroVideo.removeEventListener("loadedmetadata", onMeta);
          heroVideo.removeEventListener("error", onError);
        };
      }

      /** Map hero scroll step (0–2) to video progress (0 → 0.5 → 1). */
      const heroStepToVideoProgress = (clamped: number) => {
        const heroStep = Math.min(HERO_STEP_COUNT - 1, Math.max(0, clamped));
        return heroStep / (HERO_STEP_COUNT - 1);
      };

      const setHeroPortraits = (
        opacities: { first: number; second: number; front: number },
      ) => {
        if (isVideoScrubActive()) return;
        if (heroImage0) gsap.set(heroImage0, { opacity: opacities.first });
        if (heroImage1) gsap.set(heroImage1, { opacity: opacities.second });
        if (heroImageFront) gsap.set(heroImageFront, { opacity: opacities.front });
      };

      const scrubHeroVideo = (clamped: number) => {
        if (!isVideoScrubActive() || !heroVideo) return;

        const duration = heroVideo.duration;
        const progress = heroStepToVideoProgress(clamped);
        const target = Math.min(
          duration - 0.04,
          Math.max(0, progress * duration),
        );

        if (Math.abs(heroVideo.currentTime - target) > 0.02) {
          heroVideo.currentTime = target;
        }
        heroVideo.pause();
      };

      const setActiveProject = (index: number, blend = 0) => {
        projectTitles.forEach((title, i) => {
          const button = title.parentElement;
          button?.classList.toggle("text-accent", i === index);
          button?.classList.toggle("text-white", i !== index);
        });

        projectDetails.forEach((detail, i) => {
          gsap.set(detail, {
            opacity: i === index ? 1 : 0,
            y: i === index ? 0 : 8,
          });
        });

        projectImages.forEach((image, i) => {
          let opacity = 0;
          if (i === index) opacity = 1 - blend;
          if (i === index + 1) opacity = blend;
          gsap.set(image, {
            opacity,
            scale: 1 + (1 - opacity) * 0.03,
          });
        });

        projectDots.forEach((dot, i) => {
          gsap.set(dot, {
            backgroundColor:
              i === index
                ? "rgba(255, 90, 60, 0.95)"
                : "rgba(255, 255, 255, 0.15)",
          });
        });
      };

      const updateStoryProgress = (step: number) => {
        const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, step));

        if (clamped < 1) {
          const t = clamped;
          gsap.set(heroCopies.first, { opacity: 1 - t, y: 0 });
          gsap.set(heroCopies.second, { opacity: t, y: 0 });
          gsap.set(heroCopies.metrics, { opacity: 0, y: 12 });
          setHeroPortraits({ first: 1 - t, second: t, front: 0 });
          scrubHeroVideo(clamped);
          gsap.set(heroMedia, { opacity: 1 });
          gsap.set(workPanel, { opacity: 0, pointerEvents: "none" });
          gsap.set(workMedia, { opacity: 0 });
          setActiveSection("hero");
        } else if (clamped < 2) {
          const t = clamped - 1;
          gsap.set(heroCopies.first, { opacity: 0, y: 0 });
          gsap.set(heroCopies.second, { opacity: 1 - t, y: 0 });
          gsap.set(heroCopies.metrics, { opacity: t, y: (1 - t) * 12 });
          setHeroPortraits({ first: 0, second: 1 - t, front: t });
          scrubHeroVideo(clamped);
          gsap.set(heroMedia, { opacity: 1 });
          gsap.set(workPanel, { opacity: 0, pointerEvents: "none" });
          gsap.set(workMedia, { opacity: 0 });
          setActiveSection("hero");
        } else if (clamped < 3) {
          const t = clamped - 2;
          gsap.set(heroCopies.first, { opacity: 0, y: 0 });
          gsap.set(heroCopies.second, { opacity: 0, y: 0 });
          gsap.set(heroCopies.metrics, { opacity: 1 - t, y: t * -12 });
          setHeroPortraits({ first: 0, second: 0, front: 1 - t * 0.35 });
          scrubHeroVideo(clamped);
          gsap.set(heroMedia, { opacity: 1 - t });
          gsap.set(workPanel, { opacity: t, pointerEvents: t > 0.5 ? "auto" : "none" });
          gsap.set(workMedia, { opacity: t });
          setActiveProject(0, 0);
          setActiveSection(t > 0.6 ? "work" : "hero");
        } else {
          const workStep = clamped - 3;
          const projectIndex = Math.min(
            WORK_STEP_COUNT - 1,
            Math.floor(workStep),
          );
          const blend = workStep - projectIndex;

          gsap.set(heroCopies.first, { opacity: 0 });
          gsap.set(heroCopies.second, { opacity: 0 });
          gsap.set(heroCopies.metrics, { opacity: 0 });
          gsap.set(heroMedia, { opacity: 0 });
          gsap.set(workPanel, { opacity: 1, pointerEvents: "auto" });
          gsap.set(workMedia, { opacity: 1 });
          setActiveProject(projectIndex, blend);
          setActiveSection("work");
        }
      };

      const storySnap = reduced
        ? undefined
        : {
            snapTo: STORY_SNAP_INCREMENT,
            duration: { min: 0.25, max: 0.55 },
            delay: 0.1,
            ease: "power2.inOut",
            directional: true,
          };

      const storyScrollBase = {
        trigger: story,
        start: "top top",
        pin,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        ...(storySnap ? { snap: storySnap } : {}),
        onUpdate: (self: ScrollTrigger) => {
          const step = self.progress * (TOTAL_STEPS - 1);
          updateStoryProgress(step);
        },
      };

      if (reduced || mobile) {
        ScrollTrigger.create({
          ...storyScrollBase,
          id: "story-scrub-mobile",
          end: () => `+=${(TOTAL_STEPS - 1) * window.innerHeight * 0.85}`,
          scrub: 0.6,
        });
      } else {
        ScrollTrigger.create({
          ...storyScrollBase,
          id: "story-scrub",
          end: () => `+=${(TOTAL_STEPS - 1) * window.innerHeight}`,
        });
      }

      const sections: Array<{
        el: HTMLElement | null;
        id: NavId;
      }> = [
        { el: approachRef.current, id: "approach" },
        { el: resultsRef.current, id: "results" },
        { el: contactRef.current, id: "contact" },
      ];

      sections.forEach(({ el, id }) => {
        if (!el) return;

        // Active nav tracking
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
          onLeaveBack: () => {
            if (!reduced && !mobile) setActiveSection("work");
          },
        });

        // Snap section to viewport start when scrolling into view
        if (!reduced) {
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "top top",
            snap: {
              snapTo: 1,
              duration: { min: 0.25, max: 0.5 },
              delay: 0.08,
              ease: "power2.inOut",
              directional: true,
            },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-approach-card]").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: reduced ? 0 : 28,
          duration: reduced ? 0 : 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: reduced ? 0 : i * 0.08,
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-results-card]").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: reduced ? 0 : 20,
          duration: reduced ? 0 : 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          delay: reduced ? 0 : i * 0.05,
        });
      });

      const contactContent = contactRef.current?.querySelector(
        "[data-contact-content]",
      );
      if (contactContent) {
        gsap.from(contactContent, {
          opacity: 0,
          y: reduced ? 0 : 32,
          duration: reduced ? 0 : 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contactContent,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      return () => {
        videoCleanup?.();
        clickHandlers.forEach(({ el, fn }) =>
          el.removeEventListener("click", fn),
        );
      };
    }, story);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
      ScrollTrigger.refresh();
    };
    motionQuery.addEventListener("change", onMotionChange);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return {
    storyRef,
    approachRef,
    resultsRef,
    contactRef,
    activeSection,
    reducedMotion,
    useVideoScrub,
    handleNavigate,
  };
}
