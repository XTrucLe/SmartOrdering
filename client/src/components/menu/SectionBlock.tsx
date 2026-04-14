import { memo } from "react";
import ItemCard from "@/components/menu/ItemCard";
import { Item, Section } from "@/types";

export const SectionBlock = memo(function SectionBlock({
  section,
  onAdd,
}: {
  section: Section;
  onAdd: (item: Item) => void;
}) {
  return (
    <section id={section.id} className="scroll-mt-20 space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-sm md:text-base font-semibold text-foreground">
          {section.name}
        </h2>
        <div className="flex-1 border-b border-border" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {section.items.map((item: Item) => (
          <ItemCard key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
});
