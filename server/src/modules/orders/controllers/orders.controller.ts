import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/orders/create-order.dto';
import { OrderStatus } from '../constants/order.constant';
import { OrderResponseDto } from '../dtos/orders/order.response.dto';
import { mapToOrderDto, mapToOrderDtos } from '../mappers/order.mapper';
@Controller('stores/:storeId/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Param('storeId', ParseUUIDPipe) storeId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(storeId, dto);
    return mapToOrderDto(order);
  }

  @Get()
  async findAll(
    @Param('storeId', ParseUUIDPipe) storeId: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAllByStore(storeId);
    return mapToOrderDtos(orders);
  }

  @Get(':orderId')
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(orderId);
    return mapToOrderDto(order);
  }

  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body('status') status: OrderStatus,
  ): Promise<OrderResponseDto> {
    const updatedOrder = await this.ordersService.updateStatus(orderId, status);
    return mapToOrderDto(updatedOrder);
  }

  @Patch(':orderId/cancel')
  async cancel(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const cancelledOrder = await this.ordersService.cancel(orderId);
    return mapToOrderDto(cancelledOrder);
  }
}
