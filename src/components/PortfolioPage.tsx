"use client";

import { ApproachSection } from "@/components/ApproachSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { SectionIndicator } from "@/components/SectionIndicator";
import { ResultsSection } from "@/components/ResultsSection";
import { WorkSection } from "@/components/WorkSection";
import { usePortfolioScroll } from "@/hooks/usePortfolioScroll";

export function PortfolioPage() {
  const {
    heroRef,
    workRef,
    approachRef,
    resultsRef,
    contactRef,
    heroFrameRef,
    activeSection,
    activeSectionIndex,
    activeProjectIndex,
    heroStepIndex,
    reducedMotion,
    useFrameSequence,
    handleNavigate,
  } = usePortfolioScroll();

  return (
    <>
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />
      <SectionIndicator
        activeSectionIndex={activeSectionIndex}
        visible={!reducedMotion}
      />

      <main className="bg-black text-white">
        <HeroSection
          ref={heroRef}
          reducedMotion={reducedMotion}
          useFrameSequence={useFrameSequence}
          frameSequenceRef={heroFrameRef}
          heroStepIndex={heroStepIndex}
        />
        <WorkSection
          ref={workRef}
          activeProjectIndex={activeProjectIndex}
        />
        <ApproachSection ref={approachRef} />
        <ResultsSection ref={resultsRef} />
        <ContactSection ref={contactRef} />
      </main>
    </>
  );
}
