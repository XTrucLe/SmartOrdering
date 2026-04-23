import { plainToInstance } from 'class-transformer';
import { Store } from './store.entity';
import { StoreResponseDto } from './dtos/store.response.dto';
import { Pages } from '@/common/interfaces/page.interface';

export function mapToStoreDto(store: Store): StoreResponseDto {
  return plainToInstance(StoreResponseDto, store, {
    excludeExtraneousValues: true,
  });
}

export function mapToStoreDtos(stores: Pages<Store>): Pages<StoreResponseDto> {
  return {
    ...stores,
    data: stores.data.map((store) =>
      plainToInstance(StoreResponseDto, store, {
        excludeExtraneousValues: true,
      }),
    ),
  };
}
