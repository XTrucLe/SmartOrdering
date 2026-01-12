import { OrderStatus } from './order.constant';

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRM, OrderStatus.CANCELLED],

  [OrderStatus.CONFIRM]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],

  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],

  [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],

  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};
