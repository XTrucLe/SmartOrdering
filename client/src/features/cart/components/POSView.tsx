"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { StaffOrderView } from "@/features/menu/components/StaffOrderView";
import { MenuNavigation } from "@/features/menu/components/MenuNavigation";
import { CartPanel } from "@/features/cart/components/CartPanel";

import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useCartStore } from "@/features/cart/cart.store";
import { SearchBox } from "@/components/common/Search";
import { useQueryState } from "@/hooks/useQueryParam";

import { Section } from "@/features/menu/types";
import { getAllSections } from "@/features/menu/services/section.service";

import { PreviousButton } from "@/app/staff/_components/PreviousButton";
import { DeliverySelection } from "./DeliverySelection";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomerInfo } from "./CustomerInfo";
import { OrderService } from "@/lib/api";

const NAV_OFFSET = 80;

export function POSScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { orderId, orderCode, loadEntity, addItem, confirmOrder, syncOrder } =
    useCartStore();

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

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await OrderService.openBill();

        if (data) {
          await loadEntity(data);
        }
      } catch (error) {
        console.error("Failed to confirm order:", error);
      }
    };

    init();
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

  if (loading) {
    return <div className="flex items-center justify-center flex-1" />;
  }

  const handleCheckout = async () => {
    const currentPath = pathname || "";

    const result = await syncOrder();
    if (result) router.push(`/staff/payment/${orderId}`);
  };

  const handleDelayedCheckout = () => {
    try {
      confirmOrder();
    } catch (error) {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-6 border-b px-6 py-2">
          <PreviousButton className="-ml-4" />
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

          {orderCode && (
            <span className="text-sm text-muted-foreground">
              Mã: {orderCode}
            </span>
          )}
        </div>
        <CustomerInfo />
        <DeliverySelection />
        <CartPanel
          handleCheckout={handleCheckout}
          handleDelayedCheckout={handleDelayedCheckout}
        />
      </aside>
    </div>
  );
}
