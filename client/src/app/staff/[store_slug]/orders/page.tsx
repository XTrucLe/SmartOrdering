"use client";

import { mockOrders } from "@/data/mock-order";
import OrderBoard from "@/features/order/components/OrderBoard";
import { OrderToolBar } from "@/features/order/components/OrderToolBar";
import { filterOrders } from "@/features/order/domain/orderFilter";
import { useMemo, useState } from "react";

function OrderPage() {
  const [filter, setFilter] = useState<{
    status: string[];
    time: string;
  }>({
    status: [],
    time: "ALL",
  });
  const [listOrders, setListOrders] = useState(mockOrders);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    let result = listOrders.filter(
      (order) => !["COMPLETED", "CANCELLED"].includes(order.status),
    );

    return filterOrders(result, filter, query);
  }, [filter, query]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <OrderToolBar
        filter={filter}
        onFilterChange={setFilter}
        query={query}
        onQueryChange={setQuery}
        leftChildren={
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Orders</h2>

            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md border bg-background shadow-sm">
                Total:{" "}
                <span className="font-semibold">{listOrders.length}</span>
              </span>

              <span className="px-2 py-1 rounded-md border border-warning bg-warning text-warning-foreground shadow-sm gap-1">
                New:{" "}
                <span className="font-semibold">
                  {listOrders.filter((o) => o.status === "PENDING").length}
                </span>
              </span>
            </div>
          </div>
        }
      />

      <OrderBoard orders={filteredData} />
    </div>
  );
}

export default OrderPage;
