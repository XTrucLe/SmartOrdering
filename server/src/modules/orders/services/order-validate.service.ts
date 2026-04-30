import { Injectable } from '@nestjs/common';
import { StoreService } from '@/modules/stores/store/store.service';
import { SectionItemService } from '@/modules/menus/services/section-item.service';
import { SectionItem } from '@/modules/menus/entities/section-item.entity';
import { StoreStatus } from '@/modules/stores/common/constants/store-status.constant';

@Injectable()
export class OrderValidateService {
  constructor(
    private readonly sectionItemService: SectionItemService,
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
  ): Promise<SectionItem[]> {
    const validatedMenuItems: SectionItem[] = [];
    for (const { itemId, quantity } of items) {
      if (quantity < 0) {
        throw new Error(`Quantity for item ID ${itemId} must be greater or equal to 0`);
      }

      const sectionItem = await this.sectionItemService.findOne(storeId, itemId);

      if (!sectionItem) {
        throw new Error(`Section item with ID ${itemId} not found`);
      }
      if (!sectionItem.isAvailable) {
        throw new Error(`Section item with ID ${itemId} is not available`);
      }
      validatedMenuItems.push(sectionItem);
    }

    return validatedMenuItems;
  }
}
