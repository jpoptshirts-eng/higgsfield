"use client";

/**
 * Hero state 1 headline with Figma-intent line breaks.
 * Phrases kept intact — no awkward mid-word breaks.
 */
export function HeroHeadlineOne() {
  return (
    <h1 className="hero-heading max-w-[800px] text-white">
      <span className="block">Turning <span className="text-accent">complex</span></span>
      <span className="block">
        <span className="text-accent">behaviour</span> into
      </span>
      <span className="block">
        simple, <span className="text-accent">measurable</span>
      </span>
      <span className="block">product</span>
      <span className="block">experiences.</span>
    </h1>
  );
}
