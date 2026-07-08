"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { NavId } from "@/data/site";
import { PROJECTS } from "@/data/site";
import { createHeroVideoScrubber } from "@/hooks/heroVideoScrub";

const HERO_STEP_COUNT = 3;
const WORK_STEP_COUNT = PROJECTS.length;
const TOTAL_STEPS = HERO_STEP_COUNT + WORK_STEP_COUNT;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function getHeroCopyEls(root: HTMLElement) {
  return [
    root.querySelector<HTMLElement>('[data-hero-copy="0"]'),
    root.querySelector<HTMLElement>('[data-hero-copy="1"]'),
    root.querySelector<HTMLElement>('[data-hero-copy="metrics"]'),
  ].filter(Boolean) as HTMLElement[];
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

/** Opacity for hero copy index i at fractional hero position 0–2 */
function heroCopyOpacity(i: number, heroPos: number): number {
  return Math.max(0, 1 - Math.abs(heroPos - i));
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
      if (!el) return;

      if (reducedMotion) {
        gsap.set(window, { scrollTo: { y: el, autoKill: true } });
        return;
      }

      gsap.to(window, {
        scrollTo: { y: el, autoKill: true },
        duration: 0.85,
        ease: "power2.inOut",
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const reduced = prefersReducedMotion();
    const mobile = isMobile();
    setReducedMotion(reduced);
    setUseVideoScrub(!reduced && !mobile);

    const story = storyRef.current;
    const pin = story?.querySelector<HTMLElement>("[data-story-pin]");
    if (!story || !pin) return;

    let destroyed = false;

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
      let videoScrubber: ReturnType<typeof createHeroVideoScrubber> | null =
        null;
      let videoCleanup: (() => void) | undefined;

      const isVideoScrubActive = () =>
        !reduced &&
        !mobile &&
        !!heroVideo &&
        !heroVideo.hasAttribute("data-failed") &&
        Number.isFinite(heroVideo.duration) &&
        heroVideo.duration > 0 &&
        !!videoScrubber;

      const setHeroPortraits = (heroPos: number) => {
        if (isVideoScrubActive()) return;

        const opacities = [0, 0, 0];
        [0, 1, 2].forEach((i) => {
          opacities[i] = heroCopyOpacity(i, heroPos);
        });

        if (heroImage0) gsap.set(heroImage0, { opacity: opacities[0] });
        if (heroImage1) gsap.set(heroImage1, { opacity: opacities[1] });
        if (heroImageFront) gsap.set(heroImageFront, { opacity: opacities[2] });
      };

      const scrubHeroVideo = (heroPos: number) => {
        if (!isVideoScrubActive() || !videoScrubber) return;
        const progress = gsap.utils.clamp(
          0,
          1,
          heroPos / (HERO_STEP_COUNT - 1),
        );
        videoScrubber.setProgress(progress);
      };

      const setHeroCopy = (heroPos: number) => {
        const nearSnap = Math.abs(heroPos - Math.round(heroPos)) < 0.04;
        const pos = nearSnap ? Math.round(heroPos) : heroPos;

        heroCopies.forEach((el, i) => {
          const opacity = nearSnap ? (i === pos ? 1 : 0) : heroCopyOpacity(i, pos);
          gsap.set(el, {
            opacity,
            y: 0,
            pointerEvents: opacity > 0.98 ? "auto" : "none",
          });
        });
      };

      const setActiveProject = (index: number) => {
        const i = gsap.utils.clamp(0, WORK_STEP_COUNT - 1, index);

        projectTitles.forEach((title, idx) => {
          const button = title.parentElement;
          button?.classList.toggle("text-accent", idx === i);
          button?.classList.toggle("text-white", idx !== i);
        });

        projectDetails.forEach((detail, idx) => {
          gsap.set(detail, {
            opacity: idx === i ? 1 : 0,
            y: 0,
            pointerEvents: idx === i ? "auto" : "none",
          });
        });

        projectImages.forEach((image, idx) => {
          gsap.set(image, {
            opacity: idx === i ? 1 : 0,
            scale: 1,
            pointerEvents: "none",
          });
        });

        projectDots.forEach((dot, idx) => {
          gsap.set(dot, {
            backgroundColor:
              idx === i
                ? "rgba(255, 90, 60, 0.95)"
                : "rgba(255, 255, 255, 0.15)",
          });
        });
      };

      const hideHero = () => {
        heroCopies.forEach((el) =>
          gsap.set(el, { opacity: 0, pointerEvents: "none" }),
        );
        if (heroMedia) gsap.set(heroMedia, { opacity: 0 });
      };

      const showWork = () => {
        if (workPanel)
          gsap.set(workPanel, { opacity: 1, pointerEvents: "auto" });
        if (workMedia) gsap.set(workMedia, { opacity: 1 });
      };

      const hideWork = () => {
        if (workPanel)
          gsap.set(workPanel, { opacity: 0, pointerEvents: "none" });
        if (workMedia) gsap.set(workMedia, { opacity: 0 });
      };

      /**
       * Story scroll step 0–8:
       * 0–2 = hero states (video 0→1)
       * 2–3 = hero→work handoff
       * 3–8 = work projects 0–5
       */
      const updateStoryProgress = (step: number) => {
        const clamped = gsap.utils.clamp(0, TOTAL_STEPS - 1, step);

        if (clamped < HERO_STEP_COUNT) {
          const heroPos = clamped;
          setHeroCopy(heroPos);
          setHeroPortraits(heroPos);
          scrubHeroVideo(heroPos);
          if (heroMedia) gsap.set(heroMedia, { opacity: 1 });
          hideWork();
          setActiveSection("hero");
        } else {
          hideHero();
          showWork();
          scrubHeroVideo(HERO_STEP_COUNT - 1);
          const workPos = clamped - HERO_STEP_COUNT;
          const projectIndex = Math.round(workPos);
          setActiveProject(projectIndex);
          setActiveSection("work");
        }
      };

      let storyScrollCreated = false;

      const setupStoryScroll = () => {
        if (destroyed || storyScrollCreated) return;
        storyScrollCreated = true;

        const snapToStep = (progress: number) => {
          const step = Math.round(progress * (TOTAL_STEPS - 1));
          return step / (TOTAL_STEPS - 1);
        };

        const storySnap = reduced
          ? undefined
          : {
              snapTo: snapToStep,
              duration: { min: 0.25, max: 0.45 },
              delay: 0.08,
              ease: "power2.out",
              directional: true,
            };

        const scrollDistance = (TOTAL_STEPS - 1) * window.innerHeight;
        const scrubValue = reduced || mobile ? 0.6 : 0.9;

        ScrollTrigger.create({
          id: reduced || mobile ? "story-scrub-mobile" : "story-scrub",
          trigger: story,
          start: "top top",
          end: () =>
            `+=${mobile && !reduced ? scrollDistance * 0.85 : scrollDistance}`,
          pin,
          pinSpacing: true,
          scrub: scrubValue,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...(storySnap ? { snap: storySnap } : {}),
          onUpdate: (self) => {
            const step = self.progress * (TOTAL_STEPS - 1);
            updateStoryProgress(step);
          },
        });
      };

      if (heroVideo && !reduced && !mobile) {
        const onMeta = () => {
          if (destroyed) return;
          videoScrubber = createHeroVideoScrubber(heroVideo);
          heroVideo.pause();
          ScrollTrigger.refresh();
        };

        const onError = () => {
          heroVideo.setAttribute("data-failed", "true");
        };

        heroVideo.addEventListener("loadedmetadata", onMeta, { once: true });
        heroVideo.addEventListener("error", onError, { once: true });
        heroVideo.pause();

        if (heroVideo.readyState >= 1) {
          onMeta();
        }

        videoCleanup = () => {
          heroVideo.removeEventListener("error", onError);
          videoScrubber?.destroy();
        };
      }

      setupStoryScroll();

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

        if (!reduced) {
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "top top",
            snap: {
              snapTo: 1,
              duration: { min: 0.25, max: 0.45 },
              delay: 0.08,
              ease: "power2.out",
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
        destroyed = true;
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
