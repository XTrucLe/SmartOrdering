import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MenuItemResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() imageUrl?: string;
  @Expose() price: number;
  @Expose() available: boolean;
  @Expose() displayOrder: number;
}
