"use client";

import { useMemo, useState, useCallback } from "react";
import OrdersList from "@/components/orders/OrdersList";
import { mockOrders } from "@/data/mock-order";
import OrderDetail from "@/components/orders/OrderDetail";
import { ORDER_STATUS } from "@/types";
import { SegmentControl } from "@/components/common/SegmentControl";

const ORDER_FILTER_STATES = {
  ALL: "all",
  PENDING: "pending",
  COMPLETE: "complete",
} as const;

type OrderFilterState =
  (typeof ORDER_FILTER_STATES)[keyof typeof ORDER_FILTER_STATES];

const filterOptions: { value: OrderFilterState; label: string }[] = [
  {
    value: ORDER_FILTER_STATES.ALL,
    label: "Tất cả",
  },
  {
    value: ORDER_FILTER_STATES.PENDING,
    label: "Đang xử lý",
  },
  {
    value: ORDER_FILTER_STATES.COMPLETE,
    label: "Hoàn thành",
  },
];

function OrdersPage() {
  const orders = mockOrders;

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilterState>(
    ORDER_FILTER_STATES.ALL,
  );

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) {
      return null;
    }
    return orders.find((order) => order.id === selectedOrderId) ?? null;
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    if (filter === ORDER_FILTER_STATES.ALL) {
      return orders;
    }

    return orders.filter((order) => {
      switch (filter) {
        case ORDER_FILTER_STATES.PENDING:
          return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(
            order.status,
          );
        case ORDER_FILTER_STATES.COMPLETE:
          return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(
            order.status,
          );
        default:
          return true;
      }
    });
  }, [orders, filter]);

  const handleFilterChange = useCallback((newValue: string) => {
    if (
      Object.values(ORDER_FILTER_STATES).includes(newValue as OrderFilterState)
    ) {
      setFilter(newValue as OrderFilterState);
    }
  }, []);

  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
  }, []);

  return (
    <div className="flex h-full w-full flex-row">
      <div className="flex min-w-120 flex-1 flex-col">
        <SegmentControl
          options={filterOptions}
          onChange={handleFilterChange}
          className="mt-2"
        />
        <OrdersList orderData={filteredOrders} onClick={handleSelectOrder} />
      </div>
      <div className="w-140">
        <OrderDetail order={selectedOrder} />
      </div>
    </div>
  );
}

export default OrdersPage;
