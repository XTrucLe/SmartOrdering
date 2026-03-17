"use client";

import { useState } from "react";
import OrdersList from "@/components/orders/OrdersList";
import { mockOrders } from "@/data/mock-order";
import OrderDetail from "@/components/orders/OrderDetail";
import { Order } from "@/types";

function OrdersPage() {
  const orderData = mockOrders;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSelectOrder = (orderId: string) => {
    const selected = orderData.find((order) => order.id === orderId);
    setSelectedOrder(selected || null);
  };

  return (
    <div className="flex flex-row h-screen w-full">
      <OrdersList orderData={orderData} onClick={handleSelectOrder} />
      <OrderDetail order={selectedOrder} />
    </div>
  );
}

export default OrdersPage;
