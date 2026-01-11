import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderItemsService } from '../services/order-items.service';
import { CreateOrderItemDto } from '../dtos/order-items/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/order-items/update-order-item.dto';
import { OrderItemResponseDto } from '../dtos/order-items/order-item.response.dto';
import { mapToOrderItemDto } from '../mappers/order-item.mapper';

@Controller()
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post('orders/:orderId/items')
  async addItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: CreateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    const orderItem = await this.orderItemsService.addItemToOrder(orderId, dto);
    return mapToOrderItemDto(orderItem);
  }

  @Patch('order-items/:itemId')
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    const orderItem = await this.orderItemsService.updateItem(itemId, dto);
    return mapToOrderItemDto(orderItem);
  }

  @Delete('order-items/:itemId')
  async removeItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.orderItemsService.removeItem(itemId);
  }
}
