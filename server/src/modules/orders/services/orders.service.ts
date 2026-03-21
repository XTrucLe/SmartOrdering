import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dtos/orders/create-order.dto';
import {
  CancelReason,
  DELIVERY_FEE_AMOUNT,
  DeliveryMethod,
  OrderStatus,
} from '../constants/order.constant';
import { StoresService } from '../../stores/stores.service';
import { VALID_TRANSITIONS } from '../constants/transition.constant';
import { MenuItemService } from 'src/modules/menus/services/menu-item.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly storesService: StoresService,
    private readonly itemsService: MenuItemService,
  ) {}

  async create(storeId: string, dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const store = await this.storesService.getStoreById(storeId);
      if (!store) {
        throw new NotFoundException(`Store with ID ${storeId} not found`);
      }

      const itemQuantityMap = new Map<string, number>();
      for (const { itemId, quantity } of dto.items) {
        itemQuantityMap.set(
          itemId,
          (itemQuantityMap.get(itemId) ?? 0) + quantity,
        );
      }

      const itemIds = [...itemQuantityMap.keys()];
      const dbItems = await Promise.all(
        itemIds.map((id) => this.itemsService.findOne(storeId, id)),
      );

      if (dbItems.length !== itemIds.length) {
        const foundIds = new Set(dbItems.map((i) => i.id));
        const missingIds = itemIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Items not found: ${missingIds.join(', ')}`,
        );
      }

      let subTotal = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dbItems) {
        if (item.item.store.id !== storeId) {
          throw new BadRequestException(
            `Item ${item.id} does not belong to store ${storeId}`,
          );
        }

        const quantity = itemQuantityMap.get(item.id)!;

        orderItems.push(
          queryRunner.manager.create(OrderItem, {
            item,
            itemName: item.item.name,
            price: item.price,
            quantity,
          }),
        );

        subTotal += Number(item.price) * quantity;
      }

      const deliveryFee =
        dto.deliveryMethod === DeliveryMethod.DELIVERY
          ? DELIVERY_FEE_AMOUNT
          : 0;

      const order = queryRunner.manager.create(Order, {
        ...dto,
        store,
        storeId: storeId,
        status: OrderStatus.PENDING,
        subTotal,
        deliveryFee,
        totalPrice: subTotal + deliveryFee,
        orderItems,
      });

      this.validateOrderInfo(order);

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Create order failed: ' + (error as Error).message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByStore(storeId: string): Promise<Order[]> {
    const store = await this.storesService.getStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    return this.orderRepository.find({
      where: { store: { id: storeId } },
      relations: ['orderItems', 'orderItems.item'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.item', 'store'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  async confirm(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.CONFIRM);
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

  async cancel(orderId: string, reason: CancelReason): Promise<Order> {
    return this.updateStatus(orderId, OrderStatus.CANCELLED, {
      cancelReason: reason,
    });
  }

  private async updateStatus(
    orderId: string,
    nextStatus: OrderStatus,
    option?: { cancelReason?: CancelReason },
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

    return this.orderRepository.save(order);
  }

  private validateOrderInfo(order: Order): void {
    switch (order.deliveryMethod) {
      case DeliveryMethod.DELIVERY:
        if (
          !order.customerName ||
          !order.customerContact ||
          !order.customerAddress
        ) {
          throw new BadRequestException('Missing Customer info for delivery');
        }
        if (order.table) {
          throw new BadRequestException('Delivery order must not have table');
        }
        break;

      case DeliveryMethod.DINE_IN:
        if (!order.table) {
          throw new BadRequestException('Table is required for dine-in');
        }
        if (order.customerAddress) {
          throw new BadRequestException('Dine-in must not have address');
        }
        break;

      case DeliveryMethod.TAKEAWAY:
        if (order.table || order.customerAddress) {
          throw new BadRequestException(
            'Takeaway order must not have table or address',
          );
        }
        break;
    }
  }

  async recalculateTotal(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    const subTotal = order.orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    order.subTotal = subTotal;
    order.totalPrice = subTotal + order.deliveryFee;
    await this.orderRepository.save(order);
  }
}
