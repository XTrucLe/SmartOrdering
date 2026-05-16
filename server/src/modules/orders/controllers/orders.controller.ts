import { Controller, Post, Get, Patch, Param, Body, UseGuards, Query, Put } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderFilterDto, OrderResponseDto, UpdateOrderDto } from '../dtos/order.dto';
import { mapToOrderDto, mapToOrderDtos } from '../mappers/order.mapper';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import {
  StoreManager,
  StoreStaff,
} from '@/modules/stores/common/decorators/store-role-group.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtGuard, StoreRoleGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/draft')
  async create(
    @CurrentStore('id') storeId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.createDraft(storeId, userId);
    return mapToOrderDto(order);
  }

  @Put('/draft/:orderId')
  @StoreStaff()
  async update(
    @CurrentStore('id') storeId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.updateDraft(storeId, orderId, dto);
    return mapToOrderDto(order);
  }

  @Get('/draft')
  @StoreStaff()
  async getCurrentDraft(
    @CurrentStore('id') storeId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderService.getDraftsByStore(storeId, userId);
    return mapToOrderDtos(orders);
  }

  @Get('/draft/:orderId')
  @StoreStaff()
  async getDraft(
    @CurrentStore('id') storeId: string,
    @CurrentUser('sub') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.getDraftById(storeId, userId, orderId);
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

  @Get('today')
  @StoreStaff()
  async findTodayOrders(
    @CurrentStore('id') storeId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderService.findTodayOrders(storeId, userId);
    return mapToOrderDtos(orders);
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
    const confirmedOrder = await this.orderService.confirmOrder(orderId);

    return mapToOrderDto(confirmedOrder);
  }

  @Patch(':orderId/pay/cash')
  @StoreStaff()
  async payWithCash(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const paidOrder = await this.orderService.payWithCash(orderId);

    return mapToOrderDto(paidOrder);
  }

  @Patch(':orderId/complete')
  @StoreStaff()
  async completeWithPayment(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const completedOrder = await this.orderService.completeWithPayment(orderId);

    return mapToOrderDto(completedOrder);
  }

  @Patch(':orderId/complete-and-pay')
  @StoreStaff()
  async completeAndCollectPayment(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    const completedOrder = await this.orderService.completeAndCollectPayment(orderId);

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
