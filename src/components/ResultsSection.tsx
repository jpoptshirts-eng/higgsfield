"use client";

import { forwardRef } from "react";
import { RESULTS } from "@/data/site";

export const ResultsSection = forwardRef<HTMLElement>(function ResultsSection(
  _,
  ref,
) {
  return (
    <section
      ref={ref}
      id="results"
      className="relative snap-start bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="section-heading text-white">
            Results
          </h2>
          <p className="mt-4 text-base text-white/65 sm:text-lg">
            Measurable impact across product, experience and commercial outcomes.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESULTS.map((result) => (
            <article
              key={result.project}
              data-results-card
              className="results-card rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <h3 className="font-body text-lg font-semibold text-white">
                {result.project}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {result.impact}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {result.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
