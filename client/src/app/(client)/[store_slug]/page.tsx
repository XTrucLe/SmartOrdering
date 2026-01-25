"use client";

import { useCartStore } from "../_stores/cart.store";
import { MOCK_MENU } from "@/data/mock-menu";
import { Section } from "../_types";
import { useEffect, useState } from "react";
import { MenuHeader } from "../_components/menu/MenuHeader";
import { MenuToolbar } from "../_components/menu/MenuToolbar";
import { MenuSectionList } from "../_components/menu/MenuSectionList";

export default function MenuPage() {
  const menu = MOCK_MENU;
  const sections = MOCK_MENU.sections;
  const { addItem, items } = useCartStore();
  const [currentActiveId, setCurrentActiveId] = useState<string>(
    sections[0]?.id,
  );
  const cartQuantity = items.length;

  useEffect(() => {
    const sectionElements = sections
      .map((s: Section) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setCurrentActiveId(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-120px 0px -60% 0px",
      },
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <MenuHeader menu={menu} />

      <MenuToolbar
        sections={sections}
        activeId={currentActiveId}
        cartQuantity={cartQuantity}
      />

      <main className="max-w-7xl mx-auto px-4 pb-24 pt-8">
        <MenuSectionList sections={sections} onAdd={addItem} />
      </main>

      <div className="py-16 text-center ">
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-slate-400"></div>
          ))}
        </div>
        <p className="text-slate-500 italic">Chúc quý khách ngon miệng</p>
      </div>
    </>
  );
}
