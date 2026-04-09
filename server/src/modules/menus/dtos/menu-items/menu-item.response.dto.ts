import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MenuItemResponseDto {
  @Expose() id: string;
  @Expose() sectionId: string;
  @Expose() productId: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() imageUrl?: string;
  @Expose() price: number;
  @Expose() isAvailable: boolean;
  @Expose() displayOrder: number;
}
