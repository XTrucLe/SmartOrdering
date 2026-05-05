"use client";

import { useRef } from "react";

import { MenuView } from "@/features/menu/components/MenuView";
import { MenuNavigation } from "@/features/menu/components/MenuNavigation";
import { OrderPanel } from "@/features/cart/components/CartPanel";

import { MOCK_MENU } from "@/data/mock-menu";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useOrderStore } from "@/features/order/order.store";
import { SearchBox } from "@/components/common/Search";
import { useQueryState } from "@/hooks/useQueryParam";
import { Section } from "@/features/menu/types";

export function POSScreen() {
  const sections = MOCK_MENU.sections;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { items, changeQuantity, removeItem, addItem, totalPrice } =
    useOrderStore();

  const [query, setQuery] = useQueryState({
    key: "q",
    defaultValue: "",
    parse: (value) => value,
    serialize: (value) => value,
  });

  const total = totalPrice();

  const activeId = useScrollSpy(
    sections.map((s: Section) => s.id),
    {
      offset: 80,
      root: scrollRef.current,
    },
  );

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);

    if (element && scrollRef.current) {
      const scrollTop = element.offsetTop - scrollRef.current.offsetTop - 80;
      scrollRef.current.scrollTo({ top: scrollTop, behavior: "auto" });
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      <div className="flex flex-1 flex-col h-full min-h-0">
        <div className="group relative flex items-center justify-between gap-8 px-6 py-2 border-b ">
          <div className="flex-1 min-w-0 overflow-hidden">
            <MenuNavigation
              sections={sections}
              activeId={activeId}
              onSelect={handleSelect}
              variant="horizontal"
              isEmbedded
            />
          </div>

          <div className="w-full max-w-70 shrink-0">
            <div className="relative flex items-center group/search">
              <SearchBox
                value={query ?? ""}
                onChange={setQuery}
                placeholder="Tìm nhanh món ăn..."
              />
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0 p-4 custom-scrollbar"
        >
          <MenuView sections={sections} onAdd={addItem} />
          <div className="h-[40vh]" />
        </div>
      </div>

      <aside className="w-96 border-l flex flex-col">
        <div className="flex justify-between items-center border-b p-2">
          <h2 className="font-bold">Đơn hàng hiện tại</h2>
        </div>

        <OrderPanel
          items={items}
          total={total}
          disabled={!items.length}
          onDecrease={(id) => changeQuantity(id, -1)}
          onIncrease={(id) => changeQuantity(id, 1)}
          onRemove={removeItem}
          onConfirm={() => {}}
        />
      </aside>
    </div>
  );
}
