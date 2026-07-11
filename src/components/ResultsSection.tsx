"use client";

import { forwardRef } from "react";
import { RESULTS } from "@/data/site";
import { ExternalArrow } from "@/components/ui/ExternalArrow";

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
              {"presentationUrl" in result && result.presentationUrl ? (
                <a
                  href={result.presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resultPresentationLink"
                >
                  View presentation
                  <ExternalArrow className="result-presentation-arrow" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
