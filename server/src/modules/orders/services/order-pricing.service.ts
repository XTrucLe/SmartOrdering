import { Injectable } from '@nestjs/common';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderPricingService {
  calculate(
    items: OrderItem[],
    options?: {
      tax?: number;
      deliveryFee?: number;
      tip?: number;
      discount?: number;
    },
  ) {
    let subTotal = 0;

    for (const item of items) {
      subTotal += Number(item.unitPrice) * item.quantity;
    }

    const deliveryFee = options?.deliveryFee || 0;
    const tip = options?.tip || 0;
    const discount = options?.discount || 0;

    const grandTotal = subTotal + deliveryFee + tip - discount;
    const tax = (Number(grandTotal) / ((options?.tax ?? 0.1) + 1)) * (options?.tax ?? 0.1);

    return {
      subTotal,
      tax,
      deliveryFee,
      tip,
      discount,
      grandTotal,
    };
  }
}
