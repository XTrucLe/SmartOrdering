import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/orders/create-order.dto';
import { OrderResponseDto } from '../dtos/orders/order.response.dto';
import { mapToOrderDto, mapToOrderDtos } from '../mappers/order.mapper';
import { CancelReason } from '../constants/order.constant';
import { StoreGuard } from '../../stores/guards/store.guard';

@Controller('stores/:storeId/orders')
@UseGuards(StoreGuard)
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

  @Patch(':orderId/confirm')
  async confirm(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const confirmedOrder = await this.ordersService.confirm(orderId);
    return mapToOrderDto(confirmedOrder);
  }

  @Patch(':orderId/prepare')
  async prepare(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const preparedOrder = await this.ordersService.prepare(orderId);
    return mapToOrderDto(preparedOrder);
  }

  @Patch(':orderId/ready')
  async ready(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const readyOrder = await this.ordersService.ready(orderId);
    return mapToOrderDto(readyOrder);
  }

  @Patch(':orderId/complete')
  async complete(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    const completedOrder = await this.ordersService.complete(orderId);
    return mapToOrderDto(completedOrder);
  }

  @Patch(':orderId/cancel')
  async cancel(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body('reason') reason: CancelReason,
  ): Promise<OrderResponseDto> {
    const cancelledOrder = await this.ordersService.cancel(orderId, reason);
    return mapToOrderDto(cancelledOrder);
  }
}
