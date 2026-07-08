# Jacinto De Matos — Portfolio

Premium, scroll-driven one-page portfolio built with Next.js, React, TypeScript, Tailwind CSS, and GSAP ScrollTrigger.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/components/StorySection.tsx` — Pinned hero (3 states) + work split-screen showcase
- `src/hooks/usePortfolioScroll.ts` — GSAP ScrollTrigger scrub + pin logic
- `src/components/ApproachSection.tsx` — Approach cards grid
- `src/components/ResultsSection.tsx` — Results metric chips
- `src/components/ContactSection.tsx` — Final contact CTA
- `src/data/site.ts` — All copy and asset paths
- `public/images/` — Optimised hero, project, approach and contact assets

## Scroll behaviour

1. **Hero** — Pinned full-screen section. Scroll scrubs through 3 hero states (copy + portrait crossfade).
2. **Work** — Same pinned viewport transitions into split-screen project showcase (6 projects).
3. **Approach / Results / Contact** — Normal scroll with subtle reveal animations.

Scrolling up reverses all transitions. `prefers-reduced-motion` shortens scrub distance and disables motion-led effects.

## Assets

Hero portraits use high-quality stills with cinematic crossfades. To add Higgsfield-generated portrait videos later, place files in `public/media/hero/` and wire them in `StorySection`.

## Build

```bash
npm run build
npm start
```
