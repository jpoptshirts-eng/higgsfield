"use client";

import { forwardRef } from "react";
import { RESULTS } from "@/data/site";

export const ResultsSection = forwardRef<HTMLElement>(function ResultsSection(
  _,
  ref,
) {
  return (
    <section ref={ref} id="results" className="resultsSection" aria-label="Results">
      <div className="resultsInner">
        <div className="resultsGrid">
          {RESULTS.map((result) => (
            <article
              key={result.project}
              data-results-card
              className="resultCard"
            >
              <h3 className="resultCardTitle">{result.project}</h3>
              <p className="resultCardBody">{result.impact}</p>
              <ul className="resultMetricList">
                {result.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
