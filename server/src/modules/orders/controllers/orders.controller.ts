import { Controller, Post, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, OrderFilterDto, OrderResponseDto } from '../dtos/order.dto';
import { mapToOrderDto, mapToOrderDtos } from '../mappers/order.mapper';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreRoleGuard } from '@/modules/stores/guards/store-role.guard';
import { CurrentStore } from '@/modules/stores/decorators/current-store.decorator';
import { StoreManager, StoreStaff } from '@/modules/stores/decorators/store-role-group.decorator';

@Controller('orders')
@UseGuards(JwtGuard, StoreRoleGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @CurrentStore('id') storeId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.create(storeId, dto);
    return mapToOrderDto(order);
  }

  @Get()
  @StoreManager()
  async findAll(
    @CurrentStore('id') storeId: string,
    @Query() filter: OrderFilterDto,
  ): Promise<Pages<OrderResponseDto>> {
    const orders = await this.orderService.findAllByStore(storeId, filter);
    return { ...orders, data: mapToOrderDtos(orders.data) };
  }

  @Get(':orderId')
  @StoreStaff()
  async findOne(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderService.findOne(orderId);
    return mapToOrderDto(order);
  }

  @Patch(':orderId/confirm')
  @StoreStaff()
  async confirm(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const confirmedOrder = await this.orderService.confirm(orderId);
    return mapToOrderDto(confirmedOrder);
  }

  @Patch(':orderId/prepare')
  @StoreStaff()
  async prepare(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const preparedOrder = await this.orderService.prepare(orderId);
    return mapToOrderDto(preparedOrder);
  }

  @Patch(':orderId/ready')
  @StoreStaff()
  async ready(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const readyOrder = await this.orderService.ready(orderId);
    return mapToOrderDto(readyOrder);
  }

  @Patch(':orderId/complete')
  @StoreStaff()
  async complete(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const completedOrder = await this.orderService.complete(orderId);
    return mapToOrderDto(completedOrder);
  }

  @Patch(':orderId/cancel')
  @StoreStaff()
  async cancel(
    @Param('orderId') orderId: string,
    @Body('reason') reason: string,
  ): Promise<OrderResponseDto> {
    const cancelledOrder = await this.orderService.cancel(orderId, reason);
    return mapToOrderDto(cancelledOrder);
  }
}
