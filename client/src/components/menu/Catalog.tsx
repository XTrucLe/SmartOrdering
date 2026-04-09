import ItemCard from "@/components/menu/ItemCard";
import { Item, Section } from "@/types";

export function Catalog({
  sections,
  onAdd,
}: {
  sections: Section[];
  onAdd: (item: Item) => void;
}) {
  return (
    <div className="space-y-10 md:space-y-12 mt-2">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-16 space-y-6"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight whitespace-nowrap">
              {section.name}
            </h2>

            <div className="flex-1 border-b border-border translate-y-2" />

            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {section.items?.length ?? 0} items
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {section.items?.map((p: Item) => (
              <ItemCard key={p.id} item={p} onClick={onAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
