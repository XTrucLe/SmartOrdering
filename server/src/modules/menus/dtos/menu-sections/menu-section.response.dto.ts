import { Expose, Type } from 'class-transformer';
import { MenuItemResponseDto } from '../menu-items/menu-item.response.dto';

export class MenuSectionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  displayOrder?: number;

  @Expose()
  @Type(() => MenuItemResponseDto)
  menuItems: MenuItemResponseDto[];
}
