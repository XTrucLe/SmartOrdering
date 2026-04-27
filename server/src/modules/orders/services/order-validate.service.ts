import { Injectable } from '@nestjs/common';
import { StoreService } from '@/modules/stores/store/store.service';
import { MenuItemService } from '@/modules/menus/services/menu-item.service';
import { MenuItem } from '@/modules/menus/entities/menu-item.entity';
import { StoreStatus } from '@/modules/stores/common/constants/store-status.constant';

@Injectable()
export class OrderValidateService {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly storeService: StoreService,
  ) {}

  async validateStore(storeId: string): Promise<void> {
    const store = await this.storeService.getStoreById(storeId);
    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`);
    }
    if (store.status !== StoreStatus.ACTIVE) {
      throw new Error(`Store with ID ${storeId} is not active`);
    }
  }

  async validateMenuItems(
    storeId: string,
    items: { itemId: string; quantity: number }[],
  ): Promise<MenuItem[]> {
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
