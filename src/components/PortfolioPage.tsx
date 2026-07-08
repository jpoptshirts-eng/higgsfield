"use client";

import { ApproachSection } from "@/components/ApproachSection";
import { ContactSection } from "@/components/ContactSection";
import { Navigation } from "@/components/Navigation";
import { ResultsSection } from "@/components/ResultsSection";
import { StorySection } from "@/components/StorySection";
import { usePortfolioScroll } from "@/hooks/usePortfolioScroll";

export function PortfolioPage() {
  const {
    storyRef,
    approachRef,
    resultsRef,
    contactRef,
    activeSection,
    reducedMotion,
    useVideoScrub,
    handleNavigate,
  } = usePortfolioScroll();

  return (
    <>
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="bg-black text-white">
        <StorySection
          ref={storyRef}
          reducedMotion={reducedMotion}
          useVideoScrub={useVideoScrub}
        />
        <ApproachSection ref={approachRef} />
        <ResultsSection ref={resultsRef} />
        <ContactSection ref={contactRef} />
      </main>
    </>
  );
}
