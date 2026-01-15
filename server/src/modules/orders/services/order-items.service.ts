import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/order-items/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/order-items/update-order-item.dto';
import { OrderStatus } from '../constants/order.constant';
import { OrdersService } from './orders.service';
import { MenuItemService } from 'src/modules/menus/services/menu-item.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly ordersService: OrdersService,
    private readonly menuItemService: MenuItemService,
  ) {}

  async addItemToOrder(
    orderId: string,
    dto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    const order = await this.ordersService.findOne(orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be modified');
    }

    const menuItem = await this.menuItemService.findOne(
      order.store.id,
      dto.itemId,
    );

    if (menuItem.item.store.id !== order.store.id) {
      throw new BadRequestException('Item does not belong to this store');
    }

    const existedItem = await this.orderItemRepository.findOne({
      where: {
        order: { id: orderId },
        item: { id: dto.itemId },
      },
    });

    let savedItem: OrderItem;

    if (existedItem) {
      existedItem.quantity += dto.quantity;
      savedItem = await this.orderItemRepository.save(existedItem);
    } else {
      const newItem = this.orderItemRepository.create({
        order,
        item: menuItem,
        itemName: menuItem.item.name,
        price: menuItem.price,
        quantity: dto.quantity,
      });
      savedItem = await this.orderItemRepository.save(newItem);
    }

    await this.ordersService.recalculateTotal(order.id);

    return savedItem;
  }

  async updateItem(
    itemId: string,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
      relations: ['order'],
    });
    if (!item) throw new NotFoundException('Order item not found');

    if (item.order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be modified');
    }

    const newItem = this.orderItemRepository.merge(item, dto);

    const savedItem = await this.orderItemRepository.save(newItem);

    await this.ordersService.recalculateTotal(item.order.id);

    return savedItem;
  }

  async removeItem(itemId: string): Promise<void> {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
      relations: ['order'],
    });
    if (!item) throw new NotFoundException('Order item not found');

    if (item.order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be modified');
    }

    const orderId = item.order.id;

    await this.orderItemRepository.remove(item);

    await this.ordersService.recalculateTotal(orderId);
  }
}
