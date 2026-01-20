"use client";

import { SectionTabs } from "./_components/menu/SectionTabs";
import ItemCard from "./_components/menu/ProductCard";
import { CartButton } from "./_components/cart/CartButton";
import ItemCheckList from "./_components/cart/ItemCheckList";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "./_stores/cart.store";
import { MOCK_MENU } from "@/data/mock-menu";
import { Item } from "./_types";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const sections = MOCK_MENU.sections;
  const { addItem, items } = useCartStore();
  const [currentActiveId, setCurrentActiveId] = useState<string>(
    sections[0]?.id,
  );
  const cartQuantity = items.length;

  useEffect(() => {
    const sectionElements = sections
      .map((s) => document.getElementById(s.id))
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
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex-1 min-w-0">
            <SectionTabs
              sections={sections}
              activeId={currentActiveId}
              onSelect={(id) => {
                const el = document.getElementById(id);
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <CartButton quantity={cartQuantity} className="shrink-0" />
            </SheetTrigger>
            <ItemCheckList />
          </Sheet>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-10 md:space-y-12 mt-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-bold text-xl md:text-2xl text-slate-800 tracking-tight">
                {section.name}
              </h2>
              <div className="h-px flex-1 bg-slate-200/80"></div>
              <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                {section.products?.length || 0} món
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {section.products?.map((product: Item) => (
                <ItemCard key={product.id} item={product} onClick={addItem} />
              ))}
            </div>
          </section>
        ))}

        <div className="pt-16 text-center">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-slate-200"></div>
            ))}
          </div>
          <p className="text-slate-400 italic">Chúc quý khách ngon miệng</p>
        </div>
      </div>
    </>
  );
}
