"use client";

import OrderBoard from "@/features/order/components/OrderBoard";
import { OrderToolBar } from "@/features/order/components/OrderToolBar";
import { useOrders } from "@/features/order/hooks/useOrder";
import { PreviousButton } from "@/app/staff/_components/PreviousButton";

function QueuePage() {
  const { orders, filter, setFilter, query, setQuery } = useOrders();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <OrderToolBar
        filter={filter}
        onFilterChange={setFilter}
        query={query}
        onQueryChange={setQuery}
        leftChildren={<PreviousButton />}
      />

      <OrderBoard orders={orders} />
    </div>
  );
}

export default QueuePage;
