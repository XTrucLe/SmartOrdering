import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SectionItemDto {
  @Expose()
  id: string;

  @Expose()
  itemId: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  price: number;

  @Expose()
  isAvailable: boolean;

  @Expose()
  displayOrder: number;

  @Expose()
  unit: string;

  @Expose()
  options: Record<string, any>;

  @Expose()
  createdAt: Date;
}
