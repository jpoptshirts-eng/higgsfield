"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { HERO_METRICS, HERO_STATES, PROJECTS } from "@/data/site";
import { AccentText } from "@/components/ui/AccentText";
import { ExternalArrow } from "@/components/ui/ExternalArrow";
import { HeroHeadlineOne } from "@/components/HeroHeadlineOne";
import { HeroMedia } from "@/components/HeroMedia";
import { ScrollIndicator } from "@/components/ScrollIndicator";

type StorySectionProps = {
  reducedMotion: boolean;
  useVideoScrub: boolean;
};

export const StorySection = forwardRef<HTMLElement, StorySectionProps>(
  function StorySection({ reducedMotion, useVideoScrub }, ref) {
    return (
      <section
        ref={ref}
        id="work"
        data-story-section
        className="relative bg-black"
        aria-label="Introduction and work"
      >
        <div
          data-story-pin
          className="story-pin relative h-screen w-full bg-black"
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            <div className="relative z-10 flex min-h-0 flex-col justify-center px-6 pb-8 pt-28 md:px-12 md:pb-0 md:pt-24 lg:px-16 xl:px-20">
              {/* Hero state 1 — Figma line breaks */}
              <div
                data-hero-copy={0}
                className="hero-copy absolute inset-x-6 top-28 md:inset-x-12 md:top-1/2 md:-translate-y-1/2 lg:inset-x-16 xl:inset-x-20"
                style={{ opacity: 1 }}
              >
                <HeroHeadlineOne />
                <p className="hero-supporting mt-6 text-white/80">
                  I&apos;m <span className="text-accent">Jac</span>, a Senior
                  Product Designer with{" "}
                  <span className="text-accent">15+ years&apos;</span> experience
                  across e-commerce, fintech and ed-tech.
                </p>
              </div>

              {/* Hero state 2 */}
              <div
                data-hero-copy={1}
                className="hero-copy absolute inset-x-6 top-28 md:inset-x-12 md:top-1/2 md:-translate-y-1/2 lg:inset-x-16 xl:inset-x-20"
                style={{ opacity: 0 }}
              >
                <h1 className="hero-heading-secondary text-white">
                  <AccentText parts={HERO_STATES[1].headline} />
                </h1>
                <p className="hero-supporting mt-6 text-white/80">
                  <AccentText parts={HERO_STATES[1].supporting} />
                </p>
              </div>

              <div
                data-hero-copy="metrics"
                className="hero-copy absolute inset-x-6 top-28 md:inset-x-12 md:top-1/2 md:-translate-y-1/2 lg:inset-x-16 xl:inset-x-20"
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

              <div
                data-work-panel
                className="work-panel absolute inset-x-6 top-28 max-w-[800px] md:inset-x-12 md:top-1/2 md:-translate-y-1/2 lg:inset-x-16 xl:inset-x-20"
                style={{ opacity: 0, pointerEvents: "none" }}
              >
                <ul className="space-y-0.5 sm:space-y-1">
                  {PROJECTS.map((project, index) => (
                    <li key={project.id}>
                      <button
                        type="button"
                        data-project-trigger={index}
                        className="project-title project-list-title group flex w-full items-baseline gap-2 text-left text-white transition-colors"
                      >
                        <span data-project-label>{project.title}</span>
                        <ExternalArrow className="text-base opacity-0 transition-opacity group-hover:opacity-100 sm:text-lg" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 min-h-[120px] max-w-lg">
                  {PROJECTS.map((project, index) => (
                    <div
                      key={`${project.id}-detail`}
                      data-project-detail={index}
                      className="project-detail absolute inset-x-0 top-0 max-w-lg"
                      style={{ opacity: 0 }}
                    >
                      <p className="text-[clamp(17px,1.5vw,22px)] leading-relaxed text-white/75">
                        {project.description}
                      </p>
                      <p className="mt-4 text-[clamp(15px,1.3vw,18px)]">
                        <span className="text-accent">Key metric: </span>
                        <span className="text-white/80">{project.metric}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-2 md:hidden">
                  {PROJECTS.map((project, index) => (
                    <span
                      key={`${project.id}-dot`}
                      data-project-dot={index}
                      className="h-1 flex-1 rounded-full bg-white/15"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative min-h-[40vh] md:min-h-0 md:h-full">
              <HeroMedia className="absolute inset-0" useVideoScrub={useVideoScrub} />

              <div
                data-work-media
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: 0 }}
              >
                {PROJECTS.map((project, index) => (
                  <div
                    key={project.id}
                    data-project-image={index}
                    className="absolute inset-0 flex items-center justify-center bg-black p-4 sm:p-8"
                    style={{ opacity: 0 }}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        loading={index < 2 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ScrollIndicator visible={!reducedMotion} />
        </div>
      </section>
    );
  },
);
