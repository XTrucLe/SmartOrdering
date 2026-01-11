import { plainToInstance } from 'class-transformer';
import { Order } from '../entities/order.entity';
import { OrderResponseDto } from '../dtos/orders/order.response.dto';

export function mapToOrderDto(order: Order): OrderResponseDto {
  const orderDto = plainToInstance(OrderResponseDto, order, {
    excludeExtraneousValues: true,
  });
  return orderDto;
}
export function mapToOrderDtos(orders: Order[]): OrderResponseDto[] {
  return orders.map((order) => mapToOrderDto(order));
}
