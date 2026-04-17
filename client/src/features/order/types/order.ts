import { OrderItem } from "./order-item";
import {
  CancelReason,
  DeliveryMethod,
  OrderStatus,
  PaymentStatus,
} from "../constants/order.constant";

export type Order = {
  id: string;

  storeId: string;

  orderItems: OrderItem[];

  customerName?: string;
  customerContact?: string;
  customerAddress?: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;

  table?: string;

  notes?: string;

  subTotal: number;
  deliveryFee: number;
  totalPrice: number;

  cancelReason?: CancelReason;

  createdAt: string;
  updatedAt?: string;
};
