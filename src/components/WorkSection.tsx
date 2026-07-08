"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { PROJECTS } from "@/data/site";
import { ExternalArrow } from "@/components/ui/ExternalArrow";

export const WorkSection = forwardRef<HTMLElement>(function WorkSection(
  _props,
  ref,
) {
  return (
    <section
      ref={ref}
      id="work"
      data-work-section
      className="relative bg-black"
      aria-label="Work"
    >
      <div
        data-work-pin
        className="work-pin relative h-screen w-full overflow-hidden bg-black"
      >
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          <div className="relative z-10 flex min-h-0 flex-col justify-center px-6 pb-8 pt-28 md:px-0 md:pb-0 md:pt-24">
            <div data-work-panel className="work-panel">
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

              <div className="relative mt-8 min-h-[140px] max-w-xl">
                {PROJECTS.map((project, index) => (
                  <div
                    key={`${project.id}-detail`}
                    data-project-detail={index}
                    className="project-detail absolute inset-x-0 top-0 max-w-lg"
                    style={{ opacity: 0, pointerEvents: "none" }}
                  >
                    <p className="work-project-description leading-relaxed text-white/75">
                      {project.description}
                    </p>
                    <p className="work-project-metric mt-4">
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

          <div className="work-media-column relative min-h-[40vh] md:min-h-0 md:h-full">
            <div
              data-work-media
              className="work-media-panel absolute inset-0 overflow-hidden"
            >
              {PROJECTS.map((project, index) => (
                <div
                  key={project.id}
                  data-project-image={index}
                  className="absolute inset-0 bg-black"
                  style={{ opacity: index === 0 ? 1 : 0, pointerEvents: "none" }}
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    quality={95}
                    sizes="50vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
