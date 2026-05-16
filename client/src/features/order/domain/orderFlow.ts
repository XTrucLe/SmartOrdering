import { ORDER_STATUS, OrderStatus } from "../constants/order.constant";

export const orderFlow: Record<OrderStatus, { to: OrderStatus[] }> = {
  [ORDER_STATUS.DRAFT]: {
    to: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  },
  [ORDER_STATUS.CONFIRMED]: {
    to: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
  },
  [ORDER_STATUS.COMPLETED]: {
    to: [],
  },
  [ORDER_STATUS.CANCELLED]: {
    to: [],
  },
};
