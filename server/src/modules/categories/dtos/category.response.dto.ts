import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryStatus } from '../constants/category.constant';
import { ItemResponseDto } from '../../items/dtos/item.response.dto';

@Exclude()
export class CategoryResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() status: CategoryStatus;
  @Expose()
  @Type(() => ItemResponseDto)
  items: ItemResponseDto[];
}
