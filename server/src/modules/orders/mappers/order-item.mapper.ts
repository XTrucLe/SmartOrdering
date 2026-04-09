import { plainToInstance } from 'class-transformer';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemResponseDto } from '../dtos/order-item.dto';

export function mapToOrderItemDto(orderItem: OrderItem): OrderItemResponseDto {
  const orderItemDto = plainToInstance(OrderItemResponseDto, orderItem, {
    excludeExtraneousValues: true,
  });
  return orderItemDto;
}

export function mapToOrderItemDtos(orderItems: OrderItem[]): OrderItemResponseDto[] {
  return orderItems.map((item) => mapToOrderItemDto(item));
}
