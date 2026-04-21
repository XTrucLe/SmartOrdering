"use client";

import { useMemo, useCallback } from "react";
import { Item, Section } from "@/types";
import ItemCard from "./ItemCard";

interface MenuViewProps {
  sections: Section[];
  onAdd: (item: Item) => void;
}

export function MenuView({ sections, onAdd }: MenuViewProps) {
  const visibleSections = useMemo(
    () => sections.filter((s) => s.items?.length),
    [sections],
  );

  const handleAdd = useCallback(
    (item: Item) => {
      onAdd(item);
    },
    [onAdd],
  );

  return (
    <div className="space-y-6 px-2 pb-6">
      {visibleSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-20 space-y-3"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm md:text-base font-semibold">
              {section.name}
            </h2>
            <div className="flex-1 border-b border-border" />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {section.items.map((item) => (
              <ItemCard key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
