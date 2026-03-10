"use client";

import { SectionTabs } from "@/components/menu/SectionTabs";
import { CartButton } from "../cart/CartButton";
import ItemCheckList from "../cart/ItemCheckList";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Section } from "@/types";

export function MenuToolbar({
  sections,
  activeId,
  cartQuantity,
}: {
  sections: Section[];
  activeId: string;
  cartQuantity: number;
}) {
  const scrollOffset = 80;

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <div className="flex-1 min-w-0">
          <SectionTabs
            sections={sections}
            activeId={activeId}
            onSelect={handleSelect}
            isEmbedded={true}
          />
        </div>

        <div className="shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer transition-transform active:scale-90">
                <CartButton quantity={cartQuantity} />
              </div>
            </SheetTrigger>
            <ItemCheckList />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
