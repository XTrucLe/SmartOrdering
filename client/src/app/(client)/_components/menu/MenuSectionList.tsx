import ItemCard from "@/components/menu/ProductCard";
import { Item, Section } from "@/types";

export function MenuSectionList({
  sections,
  onAdd,
}: {
  sections: Section[];
  onAdd: (item: Item) => void;
}) {
  return (
    <div className="space-y-10 md:space-y-12">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-32">
          <h2 className="font-bold text-xl mb-6">{section.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.items?.map((p: Item) => (
              <ItemCard key={p.id} item={p} onClick={onAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
