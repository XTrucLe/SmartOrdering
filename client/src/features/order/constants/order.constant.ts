// constants/order.constants.ts

// =====================
// ORDER STATUS
// =====================
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "New",
  PROCESSING: "In Progress",
  READY: "Ready",
  COMPLETED: "Done",
  CANCELLED: "Cancelled",
};

export const ORDER_ACTIONS: Record<OrderStatus, string> = {
  PENDING: "New",
  PROCESSING: "Start",
  READY: "Serve",
  COMPLETED: "Complete",
  CANCELLED: "Cancel",
} as const;


export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const DELIVERY_METHOD = {
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
  DELIVERY: "DELIVERY",
} as const;

export type DeliveryMethod =
  (typeof DELIVERY_METHOD)[keyof typeof DELIVERY_METHOD];

export const CANCELLED_REASON = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST",
  OTHER: "OTHER",
} as const;

export type CancelReason =
  (typeof CANCELLED_REASON)[keyof typeof CANCELLED_REASON];