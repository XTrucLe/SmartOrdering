"use client";

import { useEffect, useRef } from "react";
import { Section } from "@/types";
import { cn } from "@/lib/utils";

interface SectionTabsProps {
  sections: Section[];
  activeId: string;
  onSelect?: (id: string) => void;
}

export function SectionTabs({
  sections,
  activeId,
  onSelect,
}: SectionTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    if (onSelect) onSelect(id);

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 128;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (activeId && tabsRef.current) {
      const activeButton = tabsRef.current.querySelector<HTMLButtonElement>(
        `button[data-id="${activeId}"]`,
      );

      if (activeButton) {
        const container = tabsRef.current;
        const scrollLeft =
          activeButton.offsetLeft -
          container.offsetWidth / 2 +
          activeButton.offsetWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  return (
    <div className="sticky top-0 z-30 bg-background transition-all duration-300">
      <div
        ref={tabsRef}
        className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-3 snap-x"
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <button
              key={section.id}
              data-id={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border snap-center",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {section.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
