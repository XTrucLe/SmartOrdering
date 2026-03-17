export const ORRDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
};

export const DELIVERY_METHOD = {
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
  DELIVERY: "DELIVERY",
};

export const CANCELLED_REASON = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST",
  OTHER: "OTHER",
};

export type OrderStatus = (typeof ORRDER_STATUS)[keyof typeof ORRDER_STATUS];
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type DeliveryMethod =
  (typeof DELIVERY_METHOD)[keyof typeof DELIVERY_METHOD];
export type CancelReason =
  (typeof CANCELLED_REASON)[keyof typeof CANCELLED_REASON];
