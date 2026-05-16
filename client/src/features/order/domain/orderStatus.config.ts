import { ORDER_STATUS, OrderStatus } from "../constants/order.constant";

export const ORDER_STATUS_UI: Record<
  OrderStatus,
  { border: string; badge: string }
> = {
  [ORDER_STATUS.DRAFT]: {
    border: "border-l-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
  [ORDER_STATUS.COMPLETED]: {
    border: "border-l-success",
    badge: "bg-success/10 text-success",
  },
  [ORDER_STATUS.CANCELLED]: {
    border: "border-l-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  [ORDER_STATUS.CONFIRMED]: {
    border: "border-l-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
} as const;
