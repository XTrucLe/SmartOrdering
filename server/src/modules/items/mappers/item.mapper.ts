import { plainToInstance } from 'class-transformer';
import { Item } from '../entities/item.entity';
import { ItemDto } from '../dtos/item.dto';

export class ItemMapper {
  static toDto(item: Item): ItemDto {
    return plainToInstance(ItemDto, item, { excludeExtraneousValues: true });
  }

  static toDtos(items: Item[]): ItemDto[] {
    return items.map((item) => this.toDto(item));
  }
}
