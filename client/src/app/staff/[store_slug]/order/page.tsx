"use client";

import { SearchBox } from "@/components/common/Search";
import { ToggleButton } from "@/components/common/ToggleButton";
import { Catalog } from "@/components/menu/Catalog";
import { MenuNav } from "@/components/menu/MenuNav";
import OrderPanel from "@/components/orders/OrderPanel";
import { MOCK_MENU } from "@/data/mock-menu";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useOrderStore } from "@/stores/order.store";
import { useRef, useState } from "react";

export default function OrderPage() {
  const sections = MOCK_MENU.sections;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
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

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background">
      <header className="sticky inset-x-0 top-0 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">POS System</h1>

          <ToggleButton
            options={[
              { label: "Tại bàn", value: "dine-in" },
              { label: "Mang về", value: "take-away" },
            ]}
          />
        </div>

        <div className="flex flex-1 justify-center px-10">
          <div className="w-full max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Tìm món nhanh..."
              shortcut="F2"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Nhân viên A</p>
            <p className="text-xs text-muted-foreground">Ca sáng</p>
          </div>

          <div className="h-10 w-10 rounded-full bg-muted" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <MenuNav
          sections={sections}
          activeId={activeId}
          variant="vertical"
          isEmbedded
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-20">
          <Catalog sections={sections} onAdd={addItem} />
        </div>

        <aside className="flex w-96 flex-col border-l border-border bg-background">
          <div className="border-b border-border p-4">
            <h2 className="font-bold">Đơn hàng hiện tại (#1024)</h2>
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
