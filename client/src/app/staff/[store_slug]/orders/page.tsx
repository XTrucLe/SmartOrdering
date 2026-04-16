import React from "react";
import { mockOrders } from "@/data/mock-order";
import OrderList from "@/features/order/components/OrderList";

function page() {
  const data = mockOrders.filter(
    (order) => !order.status.includes("CANCEL") && order.status !== "COMPLETED",
  );
  return (
    <div className="flex overflow-hidden h-full">
      <OrderList orders={data} />
    </div>
  );
}

export default page;
