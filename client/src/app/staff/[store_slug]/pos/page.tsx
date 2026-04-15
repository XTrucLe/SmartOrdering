"use client";

import { ToggleButton } from "@/components/common/ToggleButton";
import { Catalog } from "@/features/menu/components/Catalog";
import { MenuNav } from "@/features/menu/components/Navigation";
import OrderPanel from "@/features/order/components/Panel";
import { MOCK_MENU } from "@/data/mock-menu";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useOrderStore } from "@/stores/order.store";
import { useRef } from "react";

export default function OrderPage() {
  const sections = MOCK_MENU.sections;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items, changeQuantity, removeItem, addItem, totalPrice } =
    useOrderStore();

  const total = totalPrice();

  const activeId = useScrollSpy(
    sections.map((s) => s.id),
    {
      offset: 100,
      // eslint-disable-next-line react-hooks/refs
      root: scrollRef.current,
    },
  );

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);

    if (element && scrollRef.current) {
      const scrollTop = element.offsetTop - scrollRef.current.offsetTop - 40;
      scrollRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <MenuNav
          sections={sections}
          activeId={activeId}
          onSelect={handleSelect}
          variant="vertical"
          isEmbedded
        />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4  custom-scrollbar"
        >
          <Catalog sections={sections} onAdd={addItem} />
          <div className="h-[40vh]" />
        </div>

        <aside className="flex w-96 flex-col border-l border-border bg-background">
          <div className="flex flex-row justify-between items-center border-b border-border p-2">
            <h2 className="font-bold text-md">Đơn hàng hiện tại (#1024)</h2>
            <ToggleButton
              options={[
                { label: "Mang về", value: "takeaway" },
                { label: "Tại quán", value: "delivery" },
              ]}
            />
          </div>

          <OrderPanel
            items={items}
            total={total}
            disabled={items.length === 0}
            onDecrease={(id) => changeQuantity(id, -1)}
            onIncrease={(id) => changeQuantity(id, 1)}
            onRemove={removeItem}
            onConfirm={() => {}}
          />
        </aside>
      </div>
    </div>
  );
}
