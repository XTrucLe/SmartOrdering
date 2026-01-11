import { Exclude, Expose, Type } from 'class-transformer';
import {
  OrderStatus,
  PaymentStatus,
  DeliveryMethod,
} from '../../constants/order.constant';
import { OrderItemResponseDto } from '../order-items/order-item.response.dto';

@Exclude()
export class OrderResponseDto {
  @Expose() id: string;
  @Expose() storeId: string;
  @Expose() customerName?: string;
  @Expose() customerContact?: string;
  @Expose() customerAddress?: string;
  @Expose() status: OrderStatus;
  @Expose() paymentStatus: PaymentStatus;
  @Expose() deliveryMethod: DeliveryMethod;
  @Expose() table?: string;
  @Expose() notes?: string;
  @Expose() subTotal: number;
  @Expose() deliveryFee: number;
  @Expose() totalPrice: number;

  @Expose()
  @Type(() => OrderItemResponseDto)
  orderItems: OrderItemResponseDto[];

  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
