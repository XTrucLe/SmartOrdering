import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import {
  DeliveryMethod,
  OrderStatus,
} from '../constants/order.constant';
import { VALID_TRANSITIONS } from '../constants/transition.constant';
import { StoresService } from '@/modules/stores/services/stores.service';
import { CreateOrderDto, OrderFilterDto } from '../dtos/order.dto';
import { OrderValidateService } from './order-validate.service';
import { OrderPricingService } from './order-pricing.service';
import { AccountService } from '@/modules/identity/services/account.service';
import { DEFAULT_TAX_RATE } from '@/common/constants/taxt.default';
import { Delivery } from '../entities/delivery.entity';
import { BaseService } from '@/common/services/base.service';
import { Pages } from '@/common/interfaces/page.interface';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    orderRepository: Repository<Order>,
    private readonly validateService: OrderValidateService,
    private readonly pricingService: OrderPricingService,
    private readonly accountService: AccountService,
    private readonly dataSource: DataSource,
  ) {
    super(orderRepository, Order);
  }

  async create(storeId: string, dto: CreateOrderDto): Promise<Order> {

    await this.validateService.validateStore(storeId);

    const menuItems = await this.validateService.validateMenuItems(storeId, dto.items);

    const itemDtoMap = new Map(dto.items.map((item) => [item.itemId, item]));
    const orderItems = menuItems.map((menuItem) => {
      const itemDto = itemDtoMap.get(menuItem.id);
      if (!itemDto) {
        throw new BadRequestException(`Menu item with ID ${menuItem.id} not found in order items`);
      }

      const item = new OrderItem();
      item.menuItem = menuItem;
      item.itemName = menuItem.name;
      item.quantity = itemDto.quantity;
      item.unitPrice = menuItem.price;
      item.totalPrice = menuItem.price * itemDto.quantity;

      return item;
    });


    return await this.dataSource.transaction(async (manager) => {
      const customer = await this.accountService.getOrNewCustomer({
        phoneNumber: dto.customerPhone,
        profile: {
          ...this.splitFullName(dto.customerName),
          ...dto.delivery
        },
      }, manager);

      const deliveryFee = dto.deliveryMethod === DeliveryMethod.DELIVERY
        ? dto.deliveryFee
        : 0;

      const { subTotal, tax, tip, discount, grandTotal } = this.pricingService.calculate(orderItems, {
        tax: DEFAULT_TAX_RATE,
        deliveryFee,
        tip: dto.tip,
        discount: dto?.discount,
      });

      const order = manager.create(Order, {
        code: this.generateOrderCode(),
        storeId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        deliveryMethod: dto.deliveryMethod,
        tableId: dto.tableId,
        orderItems,
        subTotal,
        tax,
        deliveryFee,
        tip,
        discount,
        grandTotal,
        notes: dto.notes,
      });

      if (dto.deliveryMethod === DeliveryMethod.DELIVERY) {
        order.delivery = manager.create(Delivery, {
          receiverName: dto.customerName,
          receiverPhone: dto.customerPhone,
          ...dto.delivery,
        });
      }

      return await manager.save(order);
    });

  }

  async findAllByStore(storeId: string, filter: OrderFilterDto): Promise<Pages<Order>> {
    const { page = 0, limit = 10, status, paymentStatus, deliveryMethod, search, startDate, endDate } = filter;

    await this.validateService.validateStore(storeId);

    const query = this.repository.createQueryBuilder('order')
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
      query.andWhere('(order.customerName ILIKE :search OR order.customerPhone ILIKE :search OR order.code ILIKE :search)', { search: `%${search}%` });
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

  async findOne(orderId: string): Promise<Order> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.menuItem', 'store', 'delivery'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  async confirm(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.CONFIRMED);
  }

  async prepare(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.PREPARING);
  }

  async ready(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.READY);
  }

  async complete(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.COMPLETED);
  }

  async cancel(orderId: string, reason: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.CANCELLED, {
      cancelReason: reason,
    });
  }

  private async updateStatus(
    orderId: string,
    nextStatus: OrderStatus,
    option?: { cancelReason?: string },
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    const validNextStatuses = VALID_TRANSITIONS[order.status];

    if (!validNextStatuses.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${order.status} to ${nextStatus}`,
      );
    }

    if (nextStatus === OrderStatus.CANCELLED) {
      if (!option?.cancelReason) {
        throw new BadRequestException('Cancel reason is required');
      }
      order.cancelReason = option.cancelReason;
    }

    order.status = nextStatus;

    return this.repository.save(order);
  }

  private generateOrderCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${randomStr}`;
  }
  private splitFullName(fullName: string): { firstName: string; lastName: string } {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  }
}