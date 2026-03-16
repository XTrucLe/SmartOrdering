"use client";

import { useCartStore } from "@/stores/cart.store";
import { MOCK_MENU } from "@/data/mock-menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuToolbar } from "@/components/menu/MenuToolbar";
import { Catalog } from "@/components/menu/Catalog";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function MenuPage() {
  const menu = MOCK_MENU;
  const sections = menu.sections;

  const { addItem, items } = useCartStore();
  const cartQuantity = items.length;

  const activeId = useScrollSpy(
    sections.map((s) => s.id),
    {
      offset: 100,
    },
  );

  return (
    <div className="min-h-screen w-full bg-background">
      <MenuHeader menu={menu} />

      <MenuToolbar
        sections={sections}
        activeId={activeId}
        cartQuantity={cartQuantity}
      />

      <main className="max-w-7xl mx-auto px-4 pb-18 pt-8">
        <Catalog sections={sections} onAdd={addItem} />
      </main>

      <div className="py-16 text-center ">
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-slate-400"></div>
          ))}
        </div>
        <p className="text-slate-500 italic">Chúc quý khách ngon miệng </p>
      </div>
    </div>
  );
}
