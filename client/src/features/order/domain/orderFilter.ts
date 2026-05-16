import { toNow } from "@/lib/utils/date-time";
import { Order } from "../types";

export const filterOrders = (
  orders: Order[],
  filter: { status: string[]; time: string },
  query: string,
) => {
  let result = orders;

  if (query.trim()) {
    result = result.filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        (order?.table &&
          order?.table.toLowerCase().includes(query.toLowerCase())) ||
        order.orderItems.some((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        ),
    );
  }

  if (filter.status.length > 0) {
    result = result.filter((order) => filter.status.includes(order.status));
  }

  if (filter.time !== "ALL") {
    const limit = parseInt(filter.time);

    result = result.filter((order) => {
      return toNow(order.createdAt, "minutes") < limit;
    });
  }

  return result.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};
