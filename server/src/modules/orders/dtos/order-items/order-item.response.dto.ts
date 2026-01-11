import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderItemResponseDto {
  @Expose() id: string;
  @Expose() itemName: string;
  @Expose() quantity: number;
  @Expose() price: number;
  @Expose() totalPrice: number;
}
