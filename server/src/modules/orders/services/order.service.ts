import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../constants/order.constant';
import { ACCEPTED_PAYMENT_COMPLETED, VALID_TRANSITIONS } from '../constants/transition.constant';
import { OrderFilterDto, UpdateOrderDto } from '../dtos/order.dto';
import { OrderValidateService } from './order-validate.service';
import { OrderPricingService } from './order-pricing.service';
import { DEFAULT_TAX_RATE } from '@/common/constants/tax.default';
import { BaseService } from '@/common/services/base.service';
import { Pages } from '@/common/interfaces/page.interface';
import { PaymentStatus } from '../constants/payment.constant';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    orderRepository: Repository<Order>,
    private readonly validateService: OrderValidateService,
    private readonly pricingService: OrderPricingService,
    private readonly dataSource: DataSource,
  ) {
    super(orderRepository, Order);
  }

  async createDraft(storeId: string, userId: string): Promise<Order> {
    await this.validateService.validateStore(storeId);

    const existingDraft = await this.repository.findOne({
      where: { storeId, createdBy: userId, status: OrderStatus.DRAFT },
      select: ['id'],
    });

    if (existingDraft) {
      return this.getDraftById(storeId, userId, existingDraft.id);
    }

    const order = this.dataSource.manager.create(Order, {
      orderCode: this.generateOrderCode(),
      storeId,
      status: OrderStatus.DRAFT,
      orderItems: [],
      subTotal: 0,
      taxTotal: 0,
      discountTotal: 0,
      grandTotal: 0,
      createdBy: userId,
    });

    return await this.dataSource.manager.save(order);
  }

  async updateDraft(storeId: string, orderId: string, dto: UpdateOrderDto): Promise<Order> {
    await this.validateService.validateStore(storeId);

    const order = await this.dataSource.manager.findOne(Order, {
      where: {
        id: orderId,
        storeId,
      },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order is locked and cannot be modified');
    }

    return await this.dataSource.transaction(async (manager) => {
      if (dto.items) {
        const sectionItems = await this.validateService.validateSectionItems(storeId, dto.items);

        await manager.delete(OrderItem, {
          order: {
            id: order.id,
          },
        });

        const newItems: OrderItem[] = [];

        for (const itemDto of dto.items) {
          const sectionItem = sectionItems.find((item) => item.id === itemDto.itemId);

          if (!sectionItem) {
            throw new BadRequestException(`Section item ${itemDto.itemId} not found`);
          }

          const orderItem = manager.create(OrderItem, {
            order,
            sectionItem: sectionItem,

            itemId: itemDto.itemId,
            name: sectionItem.name,
            imageUrl: sectionItem.imageUrl,

            quantity: itemDto.quantity,

            unit: sectionItem.unit,
            currency: sectionItem.currency,

            unitPrice: Number(sectionItem.price),
            totalPrice: Number(sectionItem.price) * itemDto.quantity,
          });

          newItems.push(orderItem);
        }

        order.orderItems = await manager.save(OrderItem, newItems);
      }

      const { subTotal, tax, discount, grandTotal } = this.pricingService.calculate(
        order.orderItems,
        {
          tax: DEFAULT_TAX_RATE,
          deliveryFee: dto.deliveryFee ?? 0,
          tip: dto.tip,
          discount: dto.discount,
        },
      );

      order.subTotal = subTotal;
      order.taxTotal = tax;
      order.discountTotal = discount;
      order.grandTotal = grandTotal;
      order.deliveryMethod = dto.deliveryMethod ?? order.deliveryMethod;

      order.customerName = dto.customerName ?? order.customerName;
      order.customerPhone = dto.customerPhone ?? order.customerPhone;

      order.updatedAt = new Date();

      return await manager.save(order);
    });
  }

  async getDraftsByStore(storeId: string, userId: string): Promise<Order[]> {
    await this.validateService.validateStore(storeId);
    return this.repository.find({
      where: { storeId, status: OrderStatus.DRAFT, createdBy: userId },
      relations: ['orderItems', 'orderItems.sectionItem'],
    });
  }

  async getDraftById(storeId: string, userId: string, orderId: string): Promise<Order> {
    const order = await this.repository.findOne({
      where: { id: orderId, storeId, createdBy: userId },
      relations: ['orderItems', 'orderItems.sectionItem'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    if (order.status !== OrderStatus.DRAFT) {
      throw new BadRequestException('Order is not in draft status');
    }
    return order;
  }

  async deleteDraft(storeId: string, orderId: string): Promise<void> {
    const order = await this.findOne(orderId);
    if (order.storeId !== storeId) {
      throw new BadRequestException('Order does not belong to this store');
    }
    if (order.status !== OrderStatus.DRAFT) {
      throw new BadRequestException('Only draft orders can be deleted');
    }
    order.status = OrderStatus.CANCELLED;
    await this.repository.save(order);
  }

  async findAllByStore(storeId: string, filter: OrderFilterDto): Promise<Pages<Order>> {
    const {
      page = 0,
      limit = 10,
      status,
      paymentStatus,
      deliveryMethod,
      search,
      startDate,
      endDate,
    } = filter;

    await this.validateService.validateStore(storeId);

    const query = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.storeId = :storeId', { storeId });
    if (status) {
      query.andWhere('order.status = :status', { status });
    }
    if (paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (deliveryMethod) {
      query.andWhere('order.deliveryMethod = :deliveryMethod', { deliveryMethod });
    }

    if (search) {
      query.andWhere(
        '(order.customerName ILIKE :search OR order.customerPhone ILIKE :search OR order.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    const [orderData, total] = await query
      .orderBy('order.createdAt', 'DESC')
      .skip(page * limit)
      .take(limit)
      .getManyAndCount();

    return { data: orderData, total, page, limit };
  }

  async findTodayOrders(storeId: string, userId: string): Promise<Order[]> {
    const now = new Date();

    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );

    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
    );

    await this.validateService.validateStore(storeId);

    return this.repository.find({
      where: {
        storeId,
        createdBy: userId,
        createdAt: Between(start, end),
        status: OrderStatus.CONFIRMED,
      },
      order: { createdAt: 'DESC' },
      relations: ['orderItems', 'delivery'],
    });
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.sectionItem', 'store', 'delivery'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  async payWithCash(orderId: string): Promise<Order> {
    return this.updatePaymentStatus(orderId, PaymentStatus.PAID);
  }

  async confirmOrder(orderId: string): Promise<Order> {
    return this.transitionStatus(orderId, OrderStatus.CONFIRMED);
  }

  async completeWithPayment(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new BadRequestException('Order must be paid before completing');
    }

    return this.transitionStatus(orderId, OrderStatus.COMPLETED);
  }

  async completeAndCollectPayment(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid — use completeWithPayment instead');
    }

    if (order.paymentStatus === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Cannot complete a refunded order');
    }

    const allowedNext = VALID_TRANSITIONS[order.status];
    if (!allowedNext?.includes(OrderStatus.COMPLETED)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to COMPLETED`);
    }

    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.COMPLETED;
    order.paidAt = new Date();

    return this.repository.save(order);
  }

  async cancel(orderId: string, reason: string): Promise<Order> {
    if (!reason) {
      throw new BadRequestException('Cancel reason is required');
    }
    return this.transitionStatus(orderId, OrderStatus.CANCELLED, { cancelReason: reason });
  }

  private async transitionStatus(
    orderId: string,
    nextStatus: OrderStatus,
    extra?: { cancelReason?: string },
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    const allowedNext = VALID_TRANSITIONS[order.status];
    if (!allowedNext?.includes(nextStatus)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${nextStatus}`);
    }

    if (extra?.cancelReason) {
      order.cancelReason = extra.cancelReason;
    }

    order.status = nextStatus;
    return this.repository.save(order);
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.paymentStatus === paymentStatus) {
      throw new BadRequestException(`Payment is already in ${paymentStatus} status`);
    }

    const canUpdate =
      ACCEPTED_PAYMENT_COMPLETED.includes(order.status) &&
      order.paymentStatus !== PaymentStatus.REFUNDED;

    if (!canUpdate) {
      throw new BadRequestException({
        message: `Cannot update payment for order in ${order.status} status`,
        code: 'INVALID_PAYMENT_STATUS_UPDATE',
      });
    }

    if (paymentStatus === PaymentStatus.PAID) {
      order.paidAt = new Date();
    }

    order.paymentStatus = paymentStatus;
    if (order.status === OrderStatus.DRAFT) order.status = OrderStatus.CONFIRMED;

    return this.repository.save(order);
  }

  private generateOrderCode(): string {
    const timestamp = Date.now().toString(36).slice(-2).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}${randomStr}`;
  }
}
