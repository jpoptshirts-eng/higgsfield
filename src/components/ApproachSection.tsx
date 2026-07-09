"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { APPROACH_CARDS } from "@/data/site";

export const ApproachSection = forwardRef<HTMLElement>(function ApproachSection(
  _,
  ref,
) {
  return (
    <section ref={ref} id="approach" className="approachSection" aria-label="Approach">
      <div className="approachInner">
        <h2 className="approachHeading text-white">
          I design by understanding{" "}
          <span className="text-accent">behaviour</span>, connecting{" "}
          <span className="text-accent">systems</span> and{" "}
          <span className="text-accent">prototyping</span> the decisions that
          shape <span className="text-accent">better</span> products.
        </h2>

        <div className="approachCards">
          {APPROACH_CARDS.map((card, index) => (
            <article
              key={card.id}
              data-approach-card
              className={`approachCard${index > 0 ? " approachCard--divided" : ""}`}
            >
              <div className="approachCardIcon">
                <Image
                  src={card.icon}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              </div>
              <h3 className="approachCardTitle">{card.title}</h3>
              <p className="approachCardBody">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
