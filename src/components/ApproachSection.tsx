"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { APPROACH_CARDS } from "@/data/site";

export const ApproachSection = forwardRef<HTMLElement>(function ApproachSection(
  _,
  ref,
) {
  return (
    <section
      ref={ref}
      id="approach"
      className="relative snap-start bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="section-heading text-white">
            I design by understanding{" "}
            <span className="text-accent">behaviour</span>, connecting{" "}
            <span className="text-accent">systems</span> and prototyping the
            decisions that shape better products.
          </h2>
          <p className="hero-supporting mt-6 text-white/70">
            Across grocery, fintech and ed-tech, my work combines customer
            insight, product strategy, interaction design and measurable
            business impact.
          </p>
        </div>

        <div className="approach-grid mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {APPROACH_CARDS.map((card) => (
            <article
              key={card.id}
              data-approach-card
              className="approach-card rounded-2xl border border-white/8 bg-white/[0.03] p-6"
            >
              <div className="relative mb-6 aspect-square w-full max-w-[140px]">
                <Image
                  src={card.icon}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-xl text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
