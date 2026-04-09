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
      subTotal += item.unitPrice * item.quantity;
    }

    const tax = options?.tax !== undefined ? subTotal * options.tax : subTotal * 0.1; // Assuming a fixed tax rate of 10% if not specified
    const deliveryFee = options?.deliveryFee || 0;
    const tip = options?.tip || 0;
    const discount = options?.discount || 0;

    const grandTotal = subTotal + tax + deliveryFee + tip - discount;

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
