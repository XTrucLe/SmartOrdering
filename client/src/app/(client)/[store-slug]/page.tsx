"use client";

import { useMemo, useState } from "react";
import { MOCK_MENU } from "@/data/mock-menu";
import ProductCard from "@/components/menus/ProductCard";
import { SectionTabs } from "@/components/menus/SectionTabs";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { UtensilsCrossed, Store } from "lucide-react";
import { CurrentTime } from "@/components/common/current-timer";
import { CartButton } from "@/components/menus/CartButton";
import ProductCheckList from "@/components/menus/ProductCheckList";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SelectedProduct } from "@/types/menus/product";
import { useProductStore } from "../product-store";

export default function MenuPage() {
  const { selectedProducts, selectProduct } = useProductStore();
  const menu = MOCK_MENU;
  const cartQuantity = selectedProducts.length;

  const sortedSections = useMemo(() => {
    return [...menu.sections].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [menu]);

  const sectionIds = useMemo(
    () => sortedSections.map((section) => section.id),
    [sortedSections],
  );

  const activeSectionId = useScrollSpy(sectionIds);
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);

  const currentActiveId = manualActiveId || activeSectionId;

  const addNewProduct = (product: SelectedProduct) => {
    selectProduct(product);
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto p-5 pb-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  <UtensilsCrossed className="w-3 h-3" />
                  {menu.type === "MAIN"
                    ? "Thực đơn chính"
                    : "Thực đơn đặc biệt"}
                </div>
                <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block"></div>{" "}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100/60 text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Đang mở
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                  <Store className="w-3 h-3" />
                  <span className="text-[11px] font-medium">07:00 - 22:00</span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {menu.name}
                </h1>
                {menu.description && (
                  <p className="text-slate-500 text-sm md:text-lg leading-relaxed max-w-2xl">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden md:block pl-6 border-l border-slate-100">
              <CurrentTime />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 backdrop-blur-md border-b bg-white shadow-sm">
        <div className="flex max-w-7xl mx-auto">
          <SectionTabs
            sections={sortedSections}
            activeId={currentActiveId}
            onSelect={(id) => {
              setManualActiveId(id);
              setTimeout(() => setManualActiveId(null), 1000);
            }}
          />
          <Sheet>
            <SheetTrigger asChild>
              <CartButton quantity={cartQuantity} className="ml-auto" />
            </SheetTrigger>
            <ProductCheckList />
          </Sheet>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-10 md:space-y-12 mt-4">
        {sortedSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-40 md:scroll-mt-45 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="flex items-center gap-3 mb-5 md:mb-6 ">
              <h2 className="font-bold text-xl md:text-2xl text-slate-800 tracking-tight">
                {section.name}
              </h2>
              <div className="h-px flex-1 bg-slate-200/80"></div>
              <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm no-select">
                {section.products.length} món
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {[...section.products]
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => addNewProduct({ ...product, quantity: 1 })}
                  />
                ))}
            </div>
          </section>
        ))}

        <div className="pt-10 text-center">
          <div className="inline-block w-2 h-2 rounded-full bg-slate-300 mx-1"></div>
          <div className="inline-block w-2 h-2 rounded-full bg-slate-300 mx-1"></div>
          <div className="inline-block w-2 h-2 rounded-full bg-slate-300 mx-1"></div>
          <p className="text-slate-400 text-md mt-4">
            Chúc quý khách ngon miệng
          </p>
        </div>
      </div>
    </main>
  );
}
