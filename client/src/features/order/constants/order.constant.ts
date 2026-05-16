export const ORDER_STATUS = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DRAFT: "DRAFT",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  DRAFT: "Đơn nháp",
};

export const ORDER_ACTIONS: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const DELIVERY_TYPE = {
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
  DELIVERY: "DELIVERY",
} as const;

export type DeliveryType = (typeof DELIVERY_TYPE)[keyof typeof DELIVERY_TYPE];

export const CANCELLED_REASON = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST",
  OTHER: "OTHER",
} as const;

export type CancelReason =
  (typeof CANCELLED_REASON)[keyof typeof CANCELLED_REASON];
