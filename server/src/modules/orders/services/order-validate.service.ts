import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { StoresService } from '@/modules/stores/services/stores.service';
import { MenuItemService } from '@/modules/menus/services/menu-item.service';
import { MenuItem } from '@/modules/menus/entities/menu-item.entity';

@Injectable()
export class OrderValidateService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly menuItemService: MenuItemService,
        private readonly storesService: StoresService,
    ) { }


    async validateStore(storeId: string): Promise<void> {
        const store = await this.storesService.getStoreById(storeId);
        if (!store) {
            throw new Error(`Store with ID ${storeId} not found`);
        }
        if (!store.isActive) {
            throw new Error(`Store with ID ${storeId} is not active`);
        }
    }

    async validateMenuItems(storeId: string, items: { itemId: string; quantity: number }[]): Promise<MenuItem[]> {
        const validatedMenuItems: MenuItem[] = [];
        for (const { itemId, quantity } of items) {
            if (quantity < 0) {
                throw new Error(`Quantity for item ID ${itemId} must be greater or equal to 0`);
            }

            const menuItem = await this.menuItemService.findOne(storeId, itemId);

            if (!menuItem) {
                throw new Error(`Menu item with ID ${itemId} not found`);
            }
            if (!menuItem.isAvailable) {
                throw new Error(`Menu item with ID ${itemId} is not available`);
            }
            validatedMenuItems.push(menuItem);
        }

        return validatedMenuItems;
    }
}