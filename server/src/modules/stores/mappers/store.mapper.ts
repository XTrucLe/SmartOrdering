import { plainToInstance } from 'class-transformer';
import { Store } from '../entities/store.entity';
import { StoreResponseDto } from '../dtos/store.response.dto';

export function mapToStoreDto(store: Store): StoreResponseDto {
  return plainToInstance(StoreResponseDto, store, {
    excludeExtraneousValues: true,
  });
}

export function mapToStoreDtos(stores: Store[]): StoreResponseDto[] {
  return stores.map((store) =>
    plainToInstance(StoreResponseDto, store, {
      excludeExtraneousValues: true,
    }),
  );
}
