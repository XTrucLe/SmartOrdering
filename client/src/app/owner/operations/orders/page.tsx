"use client";

import { useState } from "react";
import { OrderTable } from "@/features/order/components/OrderTable";
import { mockOrders } from "@/data/mock-order";
import { OrderToolBar } from "@/features/order/components/OrderToolBar";

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<{
    status: string[];
    time: string;
  }>({
    status: [],
    time: "ALL",
  });

  const [visibleCols, setVisibleCols] = useState<(keyof (typeof orders)[0])[]>([
    ...(Object.keys(orders[0]) as (keyof (typeof orders)[0])[]).filter(
      (col) => col !== "id" && col !== "orderItems" && col !== "storeId",
    ),
  ]);

  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-hidden">
      <OrderToolBar
        query={query}
        onQueryChange={setQuery}
        filter={filters}
        onFilterChange={setFilters}
        className="sticky top-0 z-10 bg-background"
      />

      <div className="w-full pb-12 min-h-0 h-full">
        <OrderTable orders={orders} visibleCols={visibleCols} />
      </div>
    </div>
  );
}
