"use client";

import { Logo } from "@/components/ui/Logo";
import { NAV_ITEMS, type NavId } from "@/data/site";

type NavigationProps = {
  activeSection: NavId | "hero";
  onNavigate: (id: NavId | "top") => void;
};

export function Navigation({ activeSection, onNavigate }: NavigationProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 text-white md:px-10 md:py-8 lg:px-12">
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => onNavigate("top")}
        className="transition-opacity hover:opacity-80"
      >
        <Logo className="h-9 w-9 md:h-10 md:w-10" />
      </button>

      <nav aria-label="Primary">
        <ul className="flex items-center gap-6 md:gap-10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`nav-link font-body font-medium transition-colors hover:text-white ${
                    isActive ? "text-accent" : "text-white/75"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
