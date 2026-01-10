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
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderStatus } from '../constants/order.constant';
import { Order } from '../entities/order.entity';

@Controller('stores/:storeId/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Param('storeId', ParseUUIDPipe) storeId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.create(storeId, dto);
  }

  @Get()
  async findAll(
    @Param('storeId', ParseUUIDPipe) storeId: string,
  ): Promise<Order[]> {
    return this.ordersService.findAllByStore(storeId);
  }

  @Get(':orderId')
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }

  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateStatus(orderId, status);
  }

  @Patch(':orderId/cancel')
  async cancel(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<Order> {
    return this.ordersService.cancel(orderId);
  }
}
