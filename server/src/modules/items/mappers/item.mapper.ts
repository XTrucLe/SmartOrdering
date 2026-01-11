import { plainToInstance } from 'class-transformer';
import { Item } from '../entities/item.entity';
import {
  ItemResponseDto,
  ItemWithStoreResponseDto,
} from '../dtos/item.response.dto';

export function mapToItemDto(item: Item): ItemResponseDto {
  return plainToInstance(ItemResponseDto, item, {
    excludeExtraneousValues: true,
  });
}
export function mapToItemWithStoreDto(item: Item): ItemWithStoreResponseDto {
  const itemWithStore = {
    ...item,
    storeId: item.store?.id,
    storeName: item.store?.name,
    storeSlug: item.store?.slug,
  };
  return plainToInstance(ItemWithStoreResponseDto, itemWithStore, {
    excludeExtraneousValues: true,
  });
}
export function mapToItemDtos(items: Item[]): ItemResponseDto[] {
  return items.map((item) =>
    plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    }),
  );
}
export function mapToItemWithStoreDtos(
  items: Item[],
): ItemWithStoreResponseDto[] {
  return items.map((item) => {
    const itemWithStore = {
      ...item,
      storeName: item.store?.name,
      storeSlug: item.store?.slug,
    };
    return plainToInstance(ItemWithStoreResponseDto, itemWithStore, {
      excludeExtraneousValues: true,
    });
  });
}
