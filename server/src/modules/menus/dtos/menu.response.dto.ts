import { Exclude, Expose, Type } from 'class-transformer';
import { MenuStatus } from '../constants/menu.constant';
import { ItemResponseDto } from '../../items/dtos/item.response.dto';

@Exclude()
export class MenuResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() status: MenuStatus;
  @Expose()
  @Type(() => ItemResponseDto)
  items: ItemResponseDto[];
}
