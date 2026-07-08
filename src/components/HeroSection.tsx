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
                className="hero-state is-active"
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
                className="hero-state"
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
                className="hero-state"
              >
                <div className="hero-proof-list">
                  <div className="hero-proof-item">
                    <p className="hero-proof-value">6/7</p>
                    <p className="hero-proof-label">
                      Ease-of-use score for Shopping Lists concept testing
                    </p>
                    <div className="hero-proof-divider" />
                  </div>

                  <div className="hero-proof-item">
                    <p className="hero-proof-value">5m 06s faster</p>
                    <p className="hero-proof-label">
                      Quick Shop repeat-purchase journey, from sign-in to submitted order
                    </p>
                    <div className="hero-proof-divider" />
                  </div>

                  <div className="hero-proof-item">
                    <p className="hero-proof-value">50%+</p>
                    <p className="hero-proof-label">
                      Reduction in estimated delivery effort for Waitrose Cellar account strategy
                    </p>
                    <div className="hero-proof-divider" />
                  </div>

                  <div className="hero-proof-item">
                    <p className="hero-proof-value">NPS 62</p>
                    <p className="hero-proof-label">
                      Kaizen Languages learning experience shaped around motivation and retention
                    </p>
                  </div>
                </div>

                <a href="#work" className="hero-proof-cta">
                  <span>View portfolio website</span>
                  <span className="arrow inline-block align-middle">
                    <ExternalArrow />
                  </span>
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
