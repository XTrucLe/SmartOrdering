import { Exclude, Expose, Transform } from 'class-transformer';
import { MenuItem } from '../../entities/menu-item.entity';

@Exclude()
export class MenuItemResponseDto {
  @Expose() id: string;

  @Expose()
  @Transform(({ obj }: { obj: MenuItem }) => obj.item.name)
  name: string;

  @Expose()
  @Transform(({ obj }: { obj: MenuItem }) => obj.item.description)
  description?: string;

  @Expose()
  @Transform(({ obj }: { obj: MenuItem }) => obj.item.imageUrl)
  imageUrl?: string;

  @Expose() price: number;
  @Expose() available: boolean;
  @Expose() displayOrder: number;
}
