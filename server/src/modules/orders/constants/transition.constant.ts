import { OrderStatus } from './order.constant';

export const VALID_TRANSITIONS: {
  [K in OrderStatus]: readonly OrderStatus[];
} = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],

  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],

  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],

  [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],

  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};
