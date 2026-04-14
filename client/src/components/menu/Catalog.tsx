"use client";

import { useCallback, useMemo } from "react";
import { Item, Section } from "@/types";
import { SectionBlock } from "./SectionBlock";

interface CatalogProps {
  sections: Section[];
  onAdd: (item: Item) => void;
}

export function Catalog({ sections, onAdd }: CatalogProps) {
  const handleAdd = useCallback(
    (item: Item) => {
      onAdd(item);
    },
    [onAdd],
  );

  const visibleSections = useMemo(
    () => sections.filter((s) => s.items?.length),
    [sections],
  );

  return (
    <div className="space-y-6 px-2 pb-6">
      {visibleSections.map((section) => (
        <SectionBlock key={section.id} section={section} onAdd={handleAdd} />
      ))}
    </div>
  );
}
