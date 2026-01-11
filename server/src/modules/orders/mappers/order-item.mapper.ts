import { plainToInstance } from 'class-transformer';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemResponseDto } from '../dtos/order-items/order-item.response.dto';

export function mapToOrderItemDto(orderItem: OrderItem): OrderItemResponseDto {
  const orderItemDto = plainToInstance(OrderItemResponseDto, orderItem, {
    excludeExtraneousValues: true,
  });
  orderItemDto.totalPrice = orderItem.price * orderItem.quantity;
  return orderItemDto;
}

export function mapToOrderItemDtos(
  orderItems: OrderItem[],
): OrderItemResponseDto[] {
  return orderItems.map((item) => mapToOrderItemDto(item));
}
