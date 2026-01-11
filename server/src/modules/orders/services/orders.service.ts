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
  DELIVERY_FEE_AMOUNT,
  DeliveryMethod,
  OrderStatus,
} from '../constants/order.constant';
import { StoresService } from 'src/modules/stores/stores.service';
import { ItemsService } from 'src/modules/items/items.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly storesService: StoresService,
    private readonly itemsService: ItemsService,
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
      const dbItems = await this.itemsService.getItemsByIds(itemIds);

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
        if (item.store.id !== storeId) {
          throw new BadRequestException(
            `Item ${item.id} does not belong to store ${storeId}`,
          );
        }

        const quantity = itemQuantityMap.get(item.id)!;

        orderItems.push(
          queryRunner.manager.create(OrderItem, {
            item,
            itemName: item.name,
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
        store,
        status: OrderStatus.PENDING,
        deliveryMethod: dto.deliveryMethod,
        subTotal,
        deliveryFee,
        totalPrice: subTotal + deliveryFee,
        orderItems,
      });

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

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async cancel(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
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
