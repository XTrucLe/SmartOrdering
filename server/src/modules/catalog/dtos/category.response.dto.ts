import { Exclude, Expose, Type } from 'class-transformer';
import { ItemResponseDto } from '../../items/dtos/item.response.dto';

@Exclude()
export class CategoryResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;

  @Expose()
  @Type(() => ItemResponseDto)
  items: ItemResponseDto[];
}
