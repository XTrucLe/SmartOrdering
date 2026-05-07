"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { StaffOrderView } from "@/features/menu/components/StaffOrderView";
import { MenuNavigation } from "@/features/menu/components/MenuNavigation";
import { OrderPanel } from "@/features/cart/components/CartPanel";

import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useOrderStore } from "@/features/order/order.store";
import { SearchBox } from "@/components/common/Search";
import { useQueryState } from "@/hooks/useQueryParam";

import { Section } from "@/features/menu/types";
import { getAllSections } from "@/features/menu/services/section.service";

import { SplinePointer } from "lucide-react";

const NAV_OFFSET = 80;

export function POSScreen() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { items, changeQuantity, removeItem, addItem, totalPrice } =
    useOrderStore();

  const [query, setQuery] = useQueryState({
    key: "q",
    defaultValue: "",
    parse: (value) => value,
    serialize: (value) => value,
  });

  useEffect(() => {
    let mounted = true;

    const fetchSections = async () => {
      try {
        const data = await getAllSections();

        if (!mounted) return;

        setSections(data ?? []);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSections();

    return () => {
      mounted = false;
    };
  }, []);

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  const activeId = useScrollSpy(sectionIds, {
    offset: NAV_OFFSET,
    root: scrollRef.current,
  });

  const handleSelect = (id: string) => {
    if (!scrollRef.current) return;

    const element = document.getElementById(id);

    if (!element) return;

    scrollRef.current.scrollTo({
      top: element.offsetTop - NAV_OFFSET,
      behavior: "smooth",
    });
  };

  const total = totalPrice();

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <SplinePointer className="animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-6 border-b px-6 py-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <MenuNavigation
              sections={sections}
              activeId={activeId}
              onSelect={handleSelect}
              variant="horizontal"
              isEmbedded
            />
          </div>

          <div className="w-full max-w-72 shrink-0">
            <SearchBox
              value={query ?? ""}
              onChange={setQuery}
              placeholder="Tìm nhanh món ăn..."
            />
          </div>
        </header>

        <main
          ref={scrollRef}
          className="custom-scrollbar flex-1 overflow-y-auto p-4"
        >
          <StaffOrderView sections={sections} onAdd={addItem} />

          <div className="h-[36vh]" />
        </main>
      </div>

      <aside className="flex w-108 flex-col border-l">
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="font-semibold">Đơn hàng hiện tại</h2>
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
