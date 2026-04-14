"use client";

import { useEffect, useRef, useCallback } from "react";
import { Section } from "@/types";
import { cn } from "@/lib/utils";

interface MenuNavProps {
  sections: Section[];
  activeId: string;
  onSelect?: (id: string) => void;
  offset?: number;
  isEmbedded?: boolean;
  variant?: "horizontal" | "vertical";
}

export function MenuNav({
  sections,
  activeId,
  onSelect,
  offset = 100,
  isEmbedded = false,
  variant = "vertical",
}: MenuNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback(
    (id: string) => {
      onSelect?.(id);

      const element = document.getElementById(id);
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    },
    [onSelect, offset],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!activeId || !container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(
      `button[data-id="${activeId}"]`,
    );

    if (activeButton) {
      if (variant === "horizontal") {
        const scrollLeft = Math.max(
          0,
          activeButton.offsetLeft -
            container.offsetWidth / 2 +
            activeButton.offsetWidth / 2,
        );
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      } else {
        const scrollTop = Math.max(
          0,
          activeButton.offsetTop -
            container.offsetHeight / 2 +
            activeButton.offsetHeight / 2,
        );
        container.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }
  }, [activeId, variant]);

  if (variant === "horizontal") {
    return (
      <nav
        className={cn(
          "sticky top-0 z-30 w-full transition-all ",
          isEmbedded && "sticky top-0 z-30",
        )}
        aria-label="Section Navigation"
      >
        <div
          ref={scrollRef}
          role="tablist"
          className="flex items-center overflow-x-auto no-scrollbar py-2 px-4 gap-2 snap-x scroll-smooth"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                role="tab"
                data-id={section.id}
                aria-selected={isActive}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "relative whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all snap-center outline-none border focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/20 text-muted-foreground border-gray/80 hover:bg-muted",
                )}
              >
                {section.name}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col overflow-y-auto custom-scrollbar transition-all duration-300 z-10",
        !isEmbedded
          ? "w-full h-full"
          : "w-24 md:w-48 h-screen border-r shadow-sm sticky",
      )}
      style={!isEmbedded ? { top: `${offset}px` } : undefined}
    >
      <div ref={scrollRef} className="flex-1 p-2 md:p-3 scroll-smooth">
        <ul className="space-y-1.5 md:space-y-2">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <button
                  data-id={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-3 rounded-xl px-2 py-3 md:px-3 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md font-bold"
                      : "text-muted-foreground font-medium hover:bg-muted",
                  )}
                >
                  <span className="text-[11px] md:text-sm whitespace-nowrap truncate">
                    {section.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
