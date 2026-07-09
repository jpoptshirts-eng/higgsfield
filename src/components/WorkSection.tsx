"use client";

import { forwardRef } from "react";
import { PROJECTS } from "@/data/site";
import { ExternalArrow } from "@/components/ui/ExternalArrow";

type WorkSectionProps = {
  activeProjectIndex: number;
};

export const WorkSection = forwardRef<HTMLElement, WorkSectionProps>(
  function WorkSection({ activeProjectIndex }, ref) {
    const activeProject = PROJECTS[activeProjectIndex];

    return (
      <section
        ref={ref}
        id="work"
        data-work-section
        className="workSection bg-black"
        aria-label="Work"
      >
        <div className="work-section">
          <div className="work-left relative z-10">
            <div data-work-panel className="work-panel">
              <ul className="space-y-0.5 sm:space-y-1">
                {PROJECTS.map((project, index) => {
                  const isActive = index === activeProjectIndex;

                  return (
                    <li key={project.id}>
                      <a
                        href={project.caseStudyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-project-trigger={index}
                        className={`project-title project-list-title group flex w-full items-baseline gap-2 text-left transition-colors ${
                          isActive ? "is-active" : "text-white"
                        }`}
                      >
                        <span data-project-label>{project.title}</span>
                        <ExternalArrow className="project-title-arrow shrink-0" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="relative mt-8 min-h-[140px] max-w-xl">
                <div className="project-detail max-w-lg">
                  <p className="work-project-description leading-relaxed text-white/75">
                    {activeProject.description}
                  </p>
                  <p className="work-project-metric">
                    <span className="text-accent">Key metric: </span>
                    <span className="text-white/80">{activeProject.metric}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2 md:hidden">
                {PROJECTS.map((project, index) => (
                  <span
                    key={`${project.id}-dot`}
                    data-project-dot={index}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        index === activeProjectIndex
                          ? "rgba(255, 90, 60, 0.95)"
                          : "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="projectVisualPanel" aria-hidden={false}>
            <div
              key={activeProject.id}
              data-project-image={activeProject.id}
              className="work-media-slide work-media-slide--active"
              style={{ backgroundColor: activeProject.panelColor }}
            >
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="projectHeroImage"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>
    );
  },
);
