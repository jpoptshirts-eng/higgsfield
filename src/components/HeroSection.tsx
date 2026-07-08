"use client";

import { forwardRef } from "react";
import type { HeroFrameSequenceHandle } from "@/components/HeroFrameSequence";
import { HeroFrameSequence } from "@/components/HeroFrameSequence";
import { HeroHeadlineOne } from "@/components/HeroHeadlineOne";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { HERO_METRICS, HERO_STATES } from "@/data/site";
import { AccentText } from "@/components/ui/AccentText";
import { ExternalArrow } from "@/components/ui/ExternalArrow";

type HeroSectionProps = {
  reducedMotion: boolean;
  useFrameSequence: boolean;
  frameSequenceRef: React.RefObject<HeroFrameSequenceHandle | null>;
};

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection(
    { reducedMotion, useFrameSequence, frameSequenceRef },
    ref,
  ) {
    return (
      <section
        ref={ref}
        data-hero-section
        className="relative bg-black"
        aria-label="Introduction"
      >
        <div
          data-hero-pin
          className="hero-pin relative h-screen w-full overflow-hidden bg-black"
        >
          <div className="hero-copy">
            <div className="hero-copy-stack">
              <div
                data-hero-copy={0}
                className="hero-copy-layer"
                style={{ opacity: 1 }}
              >
                <HeroHeadlineOne />
                <p className="hero-subcopy text-white/80">
                  I&apos;m <span className="text-accent">Jac</span>, a Senior
                  Product Designer with{" "}
                  <span className="text-accent">15+ years&apos;</span> experience
                  across e-commerce, fintech and ed-tech.
                </p>
              </div>

              <div
                data-hero-copy={1}
                className="hero-copy-layer"
                style={{ opacity: 0 }}
              >
                <h1 className="hero-heading-secondary text-white">
                  <AccentText parts={HERO_STATES[1].headline} />
                </h1>
                <p className="hero-subcopy text-white/80">
                  <AccentText parts={HERO_STATES[1].supporting} />
                </p>
              </div>

              <div
                data-hero-copy="metrics"
                className="hero-copy-layer"
                style={{ opacity: 0 }}
              >
                <div className="space-y-8">
                  {HERO_METRICS.map((metric) => (
                    <div key={metric.value}>
                      <p className="font-display text-[clamp(36px,3.5vw,56px)] leading-none text-white">
                        {metric.value}
                      </p>
                      <p className="mt-2 text-[clamp(18px,1.6vw,24px)] leading-snug text-white/65">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
                <a
                  href="#work"
                  className="mt-10 inline-flex items-center gap-2 text-[clamp(18px,1.6vw,22px)] font-medium text-white transition-opacity hover:opacity-80"
                >
                  View portfolio website
                  <ExternalArrow />
                </a>
              </div>
            </div>
          </div>

          <HeroFrameSequence
            ref={frameSequenceRef}
            enabled={useFrameSequence}
          />

          <ScrollIndicator visible={!reducedMotion} />
        </div>
      </section>
    );
  },
);
