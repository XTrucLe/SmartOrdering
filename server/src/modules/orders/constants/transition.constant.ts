import { OrderStatus } from './order.constant';

export const VALID_TRANSITIONS: {
  [K in OrderStatus]: readonly OrderStatus[];
} = {
  [OrderStatus.DRAFT]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],

  [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],

  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

export const ACCEPTED_PAYMENT_COMPLETED = [OrderStatus.DRAFT, OrderStatus.CONFIRMED];
