"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroFrameSequenceHandle } from "@/components/HeroFrameSequence";
import type { NavId } from "@/data/site";
import { PROJECTS } from "@/data/site";

const SECTION_HERO = 0;
const SECTION_WORK = 1;
const SECTION_APPROACH = 2;
const SECTION_RESULTS = 3;
const SECTION_CONTACT = 4;

const SECTION_COUNT = 5;
const HERO_STEP_COUNT = 3;
const WORK_PROJECT_COUNT = PROJECTS.length;
const WORK_SCROLL_LOCK_MS = 750;
const HERO_SCROLL_LOCK_MS = 1050;
const WHEEL_DELTA_THRESHOLD = 20;
const DESKTOP_MIN_WIDTH = 768;

const SECTION_IDS = [
  "hero",
  "work",
  "approach",
  "results",
  "contact",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= DESKTOP_MIN_WIDTH;
}

function navIdFromIndex(index: number): NavId | "hero" {
  const id = SECTION_IDS[index];
  return id === "hero" ? "hero" : id;
}

function heroStepToProgress(step: number): number {
  if (HERO_STEP_COUNT <= 1) return 0;
  return step / (HERO_STEP_COUNT - 1);
}

export function usePortfolioScroll() {
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const heroFrameRef = useRef<HeroFrameSequenceHandle>(null);

  const sectionRefs = useRef([
    heroRef,
    workRef,
    approachRef,
    resultsRef,
    contactRef,
  ]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(SECTION_HERO);
  const [activeHeroStepIndex, setActiveHeroStepIndex] = useState(0);
  const [activeWorkProjectIndex, setActiveWorkProjectIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useFrameSequence, setUseFrameSequence] = useState(false);

  const activeSectionIndexRef = useRef(SECTION_HERO);
  const activeHeroStepIndexRef = useRef(0);
  const activeWorkProjectIndexRef = useRef(0);
  const scrollLockedRef = useRef(false);
  const scrollLockTimerRef = useRef<number | null>(null);

  const lockScroll = useCallback((duration = WORK_SCROLL_LOCK_MS) => {
    scrollLockedRef.current = true;
    if (scrollLockTimerRef.current !== null) {
      window.clearTimeout(scrollLockTimerRef.current);
    }
    scrollLockTimerRef.current = window.setTimeout(() => {
      scrollLockedRef.current = false;
      scrollLockTimerRef.current = null;
    }, duration);
  }, []);

  const applyHeroStep = useCallback(
    (step: number, options?: { immediate?: boolean }) => {
      const nextStep = Math.max(0, Math.min(HERO_STEP_COUNT - 1, step));
      activeHeroStepIndexRef.current = nextStep;
      setActiveHeroStepIndex(nextStep);
      heroFrameRef.current?.setProgress(
        heroStepToProgress(nextStep),
        options?.immediate ?? prefersReducedMotion(),
      );
    },
    [],
  );

  const goToSection = useCallback(
    (
      index: number,
      options?: {
        workProjectIndex?: number;
        heroStepIndex?: number;
        behavior?: ScrollBehavior;
      },
    ) => {
      const nextIndex = Math.max(0, Math.min(SECTION_COUNT - 1, index));
      const previousIndex = activeSectionIndexRef.current;

      activeSectionIndexRef.current = nextIndex;
      setActiveSectionIndex(nextIndex);

      if (options?.workProjectIndex !== undefined) {
        const projectIndex = Math.max(
          0,
          Math.min(WORK_PROJECT_COUNT - 1, options.workProjectIndex),
        );
        activeWorkProjectIndexRef.current = projectIndex;
        setActiveWorkProjectIndex(projectIndex);
      }

      if (nextIndex === SECTION_HERO) {
        const step =
          options?.heroStepIndex ?? activeHeroStepIndexRef.current;
        applyHeroStep(step);
      }

      const sectionChanged = previousIndex !== nextIndex;
      const el = sectionRefs.current[nextIndex]?.current;

      if (el && sectionChanged) {
        el.scrollIntoView({
          behavior: options?.behavior ?? "smooth",
          block: "start",
        });
      }
    },
    [applyHeroStep],
  );

  const handleNavigate = useCallback(
    (id: NavId | "top") => {
      if (id === "top") {
        goToSection(SECTION_HERO, {
          heroStepIndex: 0,
          behavior: "smooth",
        });
        lockScroll();
        return;
      }

      const sectionIndex = SECTION_IDS.indexOf(id as SectionId);
      if (sectionIndex < 0) return;

      if (id === "work") {
        goToSection(SECTION_WORK, {
          workProjectIndex: 0,
          behavior: "smooth",
        });
      } else {
        goToSection(sectionIndex, { behavior: "smooth" });
      }

      lockScroll();
    },
    [goToSection, lockScroll],
  );

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setReducedMotion(reduced);
    setUseFrameSequence(!reduced && isDesktopViewport());

    activeSectionIndexRef.current = SECTION_HERO;
    activeHeroStepIndexRef.current = 0;
    activeWorkProjectIndexRef.current = 0;
    applyHeroStep(0, { immediate: true });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [applyHeroStep]);

  useEffect(() => {
    if (!isDesktopViewport() || prefersReducedMotion()) return;

    const handleWheel = (event: WheelEvent) => {
      const delta = event.deltaY;
      if (Math.abs(delta) < WHEEL_DELTA_THRESHOLD) return;

      event.preventDefault();

      if (scrollLockedRef.current) return;

      const direction = delta > 0 ? "down" : "up";
      const sectionIndex = activeSectionIndexRef.current;

      if (sectionIndex === SECTION_HERO) {
        const heroStep = activeHeroStepIndexRef.current;

        if (direction === "down") {
          if (heroStep < HERO_STEP_COUNT - 1) {
            applyHeroStep(heroStep + 1);
            lockScroll(HERO_SCROLL_LOCK_MS);
            return;
          }

          activeWorkProjectIndexRef.current = 0;
          setActiveWorkProjectIndex(0);
          goToSection(SECTION_WORK, {
            workProjectIndex: 0,
            behavior: "smooth",
          });
          lockScroll(WORK_SCROLL_LOCK_MS);
          return;
        }

        if (heroStep > 0) {
          applyHeroStep(heroStep - 1);
        }

        lockScroll(HERO_SCROLL_LOCK_MS);
        return;
      }

      if (sectionIndex === SECTION_WORK) {
        const projectIndex = activeWorkProjectIndexRef.current;

        if (direction === "down") {
          if (projectIndex < WORK_PROJECT_COUNT - 1) {
            const nextProject = projectIndex + 1;
            activeWorkProjectIndexRef.current = nextProject;
            setActiveWorkProjectIndex(nextProject);
            lockScroll();
            return;
          }

          goToSection(SECTION_APPROACH, { behavior: "smooth" });
          lockScroll();
          return;
        }

        if (projectIndex > 0) {
          const prevProject = projectIndex - 1;
          activeWorkProjectIndexRef.current = prevProject;
          setActiveWorkProjectIndex(prevProject);
          lockScroll();
          return;
        }

        goToSection(SECTION_HERO, {
          heroStepIndex: HERO_STEP_COUNT - 1,
          behavior: "smooth",
        });
        lockScroll(HERO_SCROLL_LOCK_MS);
        return;
      }

      if (direction === "down") {
        const nextSection = Math.min(sectionIndex + 1, SECTION_COUNT - 1);
        if (nextSection === sectionIndex) return;

        goToSection(nextSection, { behavior: "smooth" });
        lockScroll();
        return;
      }

      const previousSection = Math.max(sectionIndex - 1, 0);
      if (previousSection === sectionIndex) return;

      if (previousSection === SECTION_WORK) {
        goToSection(SECTION_WORK, {
          workProjectIndex: WORK_PROJECT_COUNT - 1,
          behavior: "smooth",
        });
      } else {
        goToSection(previousSection, { behavior: "smooth" });
      }

      lockScroll();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollLockTimerRef.current !== null) {
        window.clearTimeout(scrollLockTimerRef.current);
      }
    };
  }, [applyHeroStep, goToSection, lockScroll]);

  useEffect(() => {
    if (isDesktopViewport()) return;

    const elements = sectionRefs.current
      .map((ref) => ref.current)
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = elements.indexOf(visible.target as HTMLElement);
        if (index < 0) return;

        activeSectionIndexRef.current = index;
        setActiveSectionIndex(index);
      },
      { threshold: [0.45, 0.6, 0.75] },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  return {
    heroRef,
    workRef,
    approachRef,
    resultsRef,
    contactRef,
    heroFrameRef,
    activeSection: navIdFromIndex(activeSectionIndex),
    activeSectionIndex,
    activeProjectIndex: activeWorkProjectIndex,
    heroStepIndex: activeHeroStepIndex,
    reducedMotion,
    useFrameSequence,
    handleNavigate,
  };
}
