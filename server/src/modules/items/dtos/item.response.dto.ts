import { Exclude, Expose } from 'class-transformer';
import { ItemStatus, ItemType } from '../constants/item.constant';

@Exclude()
export class ItemResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() imageUrl?: string;
  @Expose() price: number;
  @Expose() status: ItemStatus;
  @Expose() type: ItemType;
}

@Exclude()
export class ItemWithStoreResponseDto extends ItemResponseDto {
  @Expose() storeId: string;
  @Expose() storeName: string;
  @Expose() storeSlug: string;
}
