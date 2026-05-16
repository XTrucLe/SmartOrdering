import { OrderItem, SelectedOption } from "./order-item";
import {
  CancelReason,
  DeliveryType,
  OrderStatus,
  PaymentStatus,
} from "../constants/order.constant";
import { DeliveryInfo } from "../../cart/types/delivery";

export type Order = {
  id: string;
  orderCode?: string;

  storeId: string;

  orderItems: OrderItem[];

  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryType;

  table?: string;

  notes?: string;

  subTotal: number;
  deliveryFee: number;
  totalPrice: number;

  cancelReason?: CancelReason;

  createdAt: string;
  updatedAt?: string;
};

export type CreateOrderRequest = {
  items: {
    itemId: string;
    quantity: number;
    options?: SelectedOption[];
  }[];

  deliveryMethod: DeliveryType;

  customerName?: string;
  customerPhone?: string;

  tableId?: string;

  deliveryFee?: number;
  tip?: number;
  discount?: number;

  notes?: string;

  delivery?: DeliveryInfo;
};
