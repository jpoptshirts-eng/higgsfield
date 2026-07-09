"use client";

import { Logo } from "@/components/ui/Logo";
import { NAV_ITEMS, type NavId } from "@/data/site";

type NavigationProps = {
  activeSection: NavId | "hero";
  onNavigate: (id: NavId | "top") => void;
};

export function Navigation({ activeSection, onNavigate }: NavigationProps) {
  return (
    <header className="site-header">
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => onNavigate("top")}
        className="logo transition-opacity hover:opacity-80"
      >
        <Logo className="h-9 w-9 md:h-10 md:w-10" />
      </button>

      <nav className="site-nav" aria-label="Primary">
        <ul className="flex items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`nav-link transition-colors ${isActive ? "is-active" : ""}`}
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
