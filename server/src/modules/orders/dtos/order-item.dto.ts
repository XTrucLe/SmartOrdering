import { IsUUID, IsNumber, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}

@Exclude()
export class OrderItemResponseDto {
  @Expose() id: string;
  @Expose() itemName: string;
  @Expose() quantity: number;
  @Expose() price: number;
  @Expose() totalPrice: number;
}
