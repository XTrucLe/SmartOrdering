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
import { CurrentTime } from "@/components/common/current-timer";
import { Store, UtensilsCrossed } from "lucide-react";

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
      <header>
        <div className="bg-background border-b border-border relative overflow-hidden">
          <div className="max-w-7xl mx-auto p-5 pb-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                  bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider
                  shadow-sm border border-primary/20"
                  >
                    <UtensilsCrossed className="w-3 h-3" />
                    {menu.type === "MAIN"
                      ? "Thực đơn chính"
                      : "Thực đơn đặc biệt"}
                  </div>

                  <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-success/10 text-success border border-success/20"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Đang mở
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-muted text-muted-foreground border border-border"
                  >
                    <Store className="w-3 h-3" />
                    <span className="text-[11px] font-medium">
                      07:00 - 22:00
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
                    {menu.name}
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl">
                    {menu.description}
                  </p>
                </div>
              </div>

              <div className="hidden md:block pl-6 border-l border-border">
                <CurrentTime />
              </div>
            </div>
          </div>
        </div>
      </header>

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

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-10 md:space-y-12 pt-8 ">
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
              <div key={i} className="w-2 h-2 rounded-full bg-slate-400"></div>
            ))}
          </div>
          <p className="text-slate-500 italic">Chúc quý khách ngon miệng</p>
        </div>
      </div>
    </>
  );
}
