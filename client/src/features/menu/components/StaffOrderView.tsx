"use client";

import { useMemo, useCallback } from "react";
import { Section } from "../types";
import ItemCard from "./ItemCard";
import { OrderItemPayload } from "@/features/order/types";

interface StaffOrderViewProps {
  sections: Section[];
  onAdd: (payload: OrderItemPayload) => void;
}

export function StaffOrderView({ sections, onAdd }: StaffOrderViewProps) {
  const visibleSections = useMemo(
    () => sections.filter((s) => s.items?.length),
    [sections],
  );

  const handleAdd = useCallback(
    (payload: OrderItemPayload) => {
      onAdd(payload);
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

          <div className="grid grid-cols-[repeat(auto-fill,minmax(156px,1fr))] gap-3 pl-2">
            {section.items.map((item) => (
              <ItemCard key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
