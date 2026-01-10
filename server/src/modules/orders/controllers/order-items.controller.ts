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
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';

@Controller()
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post('orders/:orderId/items')
  async addItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: CreateOrderItemDto,
  ) {
    return this.orderItemsService.addItemToOrder(orderId, dto);
  }

  @Patch('order-items/:itemId')
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateItem(itemId, dto);
  }

  @Delete('order-items/:itemId')
  async removeItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.orderItemsService.removeItem(itemId);
  }
}
