"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroFrameSequenceHandle } from "@/components/HeroFrameSequence";
import type { NavId } from "@/data/site";
import { PROJECTS } from "@/data/site";

const WORK_STEP_COUNT = PROJECTS.length;
const HERO_SNAP_POINTS = [0, 0.5, 1];

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

function isNearHeroSnap(progress: number): boolean {
  return HERO_SNAP_POINTS.some((point) => Math.abs(progress - point) < 0.03);
}

function heroCopyOpacity(i: number, progress: number): number {
  const heroPos = progress * 2;
  return Math.max(0, 1 - Math.abs(heroPos - i));
}

function activeHeroIndex(progress: number): number {
  if (progress < 0.33) return 0;
  if (progress < 0.66) return 1;
  return 2;
}

export function usePortfolioScroll() {
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const heroFrameRef = useRef<HeroFrameSequenceHandle>(null);

  const [activeSection, setActiveSection] = useState<NavId | "hero">("hero");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useFrameSequence, setUseFrameSequence] = useState(false);

  const handleNavigate = useCallback(
    (id: NavId | "top") => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        return;
      }

      if (id === "work") {
        const workTrigger = ScrollTrigger.getById("work-scrub");
        if (!workTrigger) return;
        if (reducedMotion) {
          window.scrollTo({ top: workTrigger.start, behavior: "auto" });
          return;
        }
        gsap.to(window, {
          scrollTo: { y: workTrigger.start, autoKill: true },
          duration: 0.85,
          ease: "power2.inOut",
        });
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
    setUseFrameSequence(!reduced && !mobile);

    const hero = heroRef.current;
    const heroPin = hero?.querySelector<HTMLElement>("[data-hero-pin]");
    const work = workRef.current;
    const workPin = work?.querySelector<HTMLElement>("[data-work-pin]");
    if (!hero || !heroPin || !work || !workPin) return;

    let destroyed = false;

    const ctx = gsap.context(() => {
      const heroCopies = getHeroCopyEls(heroPin);
      const heroImage0 = heroPin.querySelector<HTMLElement>('[data-hero-image="0"]');
      const heroImage1 = heroPin.querySelector<HTMLElement>('[data-hero-image="1"]');
      const heroImageFront = heroPin.querySelector<HTMLElement>(
        '[data-hero-image="front"]',
      );

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

      const scrollToWorkProject = (index: number) => {
        const workTrigger = ScrollTrigger.getById("work-scrub");
        if (!workTrigger) return;

        const progress = index / (WORK_STEP_COUNT - 1);
        const target =
          workTrigger.start +
          (workTrigger.end - workTrigger.start) * progress;

        if (reduced) {
          window.scrollTo({ top: target, behavior: "auto" });
          return;
        }

        gsap.to(window, {
          scrollTo: { y: target, autoKill: true },
          duration: 0.85,
          ease: "power2.inOut",
        });
      };

      projectTriggers.forEach((trigger, index) => {
        const fn = () => scrollToWorkProject(index);
        trigger.addEventListener("click", fn);
        clickHandlers.push({ el: trigger, fn });
      });

      const frameSequenceActive = !reduced && !mobile;

      const setHeroPortraits = (progress: number) => {
        if (frameSequenceActive) return;

        const opacities = [0, 0, 0];
        [0, 1, 2].forEach((i) => {
          opacities[i] = heroCopyOpacity(i, progress);
        });

        if (heroImage0) gsap.set(heroImage0, { opacity: opacities[0] });
        if (heroImage1) gsap.set(heroImage1, { opacity: opacities[1] });
        if (heroImageFront) gsap.set(heroImageFront, { opacity: opacities[2] });
      };

      const activeHeroStateRef = { current: -1 };

      const setHeroState = (progress: number) => {
        const next = activeHeroIndex(progress);
        if (next === activeHeroStateRef.current) return;
        activeHeroStateRef.current = next;

        heroCopies.forEach((el, i) => {
          el.classList.toggle("is-active", i === next);
        });
      };

      const updateHero = (progress: number) => {
        setHeroState(progress);
        setHeroPortraits(progress);
        heroFrameRef.current?.setProgress(progress);
        if (activeSectionRef.current !== "hero") {
          activeSectionRef.current = "hero";
          setActiveSection("hero");
        }
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

      const activeSectionRef = { current: "hero" as NavId | "hero" };

      const heroSnap = reduced
        ? undefined
        : {
            snapTo: HERO_SNAP_POINTS,
            duration: { min: 0.25, max: 0.45 },
            delay: 0.08,
            ease: "power2.out",
            directional: true,
          };

      ScrollTrigger.create({
        id: "hero-scrub",
        trigger: hero,
        start: "top top",
        end: "+=300%",
        pin: heroPin,
        pinSpacing: true,
        scrub: reduced || mobile ? 0.6 : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        ...(heroSnap ? { snap: heroSnap } : {}),
        onUpdate: (self) => updateHero(self.progress),
      });

      const onHeroFramesReady = () => {
        if (destroyed) return;
        ScrollTrigger.refresh();
      };
      window.addEventListener("hero-frames-ready", onHeroFramesReady);

      const workSnap = reduced
        ? undefined
        : {
            snapTo: 1 / (WORK_STEP_COUNT - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0.06,
            ease: "power2.out",
            directional: true,
          };

      ScrollTrigger.create({
        id: "work-scrub",
        trigger: work,
        start: "top top",
        end: () => `+=${(WORK_STEP_COUNT - 1) * window.innerHeight}`,
        pin: workPin,
        pinSpacing: true,
        scrub: reduced || mobile ? 0.6 : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        ...(workSnap ? { snap: workSnap } : {}),
        onUpdate: (self) => {
          const index = Math.round(self.progress * (WORK_STEP_COUNT - 1));
          setActiveProject(index);
          if (activeSectionRef.current !== "work") {
            activeSectionRef.current = "work";
            setActiveSection("work");
          }
        },
      });

      const sections: Array<{ el: HTMLElement | null; id: NavId }> = [
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
            if (!reduced) setActiveSection("work");
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

      updateHero(0);
      setActiveProject(0);

      return () => {
        destroyed = true;
        window.removeEventListener("hero-frames-ready", onHeroFramesReady);
        clickHandlers.forEach(({ el, fn }) =>
          el.removeEventListener("click", fn),
        );
      };
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
      ScrollTrigger.refresh();
    };
    motionQuery.addEventListener("change", onMotionChange);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 1000);

    return () => {
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return {
    heroRef,
    workRef,
    approachRef,
    resultsRef,
    contactRef,
    heroFrameRef,
    activeSection,
    reducedMotion,
    useFrameSequence,
    handleNavigate,
  };
}
