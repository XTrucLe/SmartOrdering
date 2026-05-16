"use client";

import { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "../order.store";
import { filterOrders } from "../domain/orderFilter";
import { ORDER_STATUS } from "../constants/order.constant";

export function useOrders() {
  const { orders, fetchOrders } = useOrderStore();

  const [filter, setFilter] = useState({
    status: [] as string[],
    time: "ALL",
  });

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return filterOrders(orders, filter, query);
  }, [orders, filter, query]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      new: orders.filter((o) => o.status === ORDER_STATUS.CONFIRMED).length,
    };
  }, [orders]);

  return {
    orders: filteredOrders,
    rawOrders: orders,
    filter,
    setFilter,
    query,
    setQuery,
    stats,
    reload: fetchOrders,
  };
}
