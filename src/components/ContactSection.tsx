"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { CONTACT_LINKS } from "@/data/site";
import { ExternalArrow } from "@/components/ui/ExternalArrow";

const CONTACT_PORTRAIT = "/media/contact/jacinto-contact-prayer.png";

export const ContactSection = forwardRef<HTMLElement>(function ContactSection(
  _,
  ref,
) {
  return (
    <section
      ref={ref}
      id="contact"
      className="relative min-h-screen snap-start bg-black"
    >
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-28 md:px-12 lg:px-16 xl:px-20">
          <div data-contact-content className="max-w-[800px]">
            <h2 className="contact-heading text-white">
              <span className="block">
                Let&apos;s <span className="text-accent-pink">build</span>{" "}
                something
              </span>
              <span className="block">
                <span className="text-accent">meaningful</span> together.
              </span>
            </h2>
            <p className="hero-supporting mt-8 max-w-lg text-white/70">
              Available for senior product design opportunities, strategic
              design work and collaborative product challenges.
            </p>

            <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              {CONTACT_LINKS.map((link, index) => (
                <li key={link.label} className="flex items-center gap-8">
                  <a
                    href={link.href}
                    className="nav-link inline-flex items-center gap-1.5 font-body font-medium text-white transition-opacity hover:opacity-80"
                  >
                    {link.label}
                    <ExternalArrow className="text-sm" />
                  </a>
                  {index < CONTACT_LINKS.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden h-4 w-px bg-white/20 sm:block"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Isolated portrait only — no baked-in nav or copy */}
        <div className="relative min-h-[55vh] overflow-hidden bg-black md:min-h-screen">
          <Image
            src={CONTACT_PORTRAIT}
            alt="Jacinto De Matos introspective portrait"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[65%_25%] md:object-[70%_20%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60"
          />
        </div>
      </div>
    </section>
  );
});
