import {
  IsUUID,
  IsNumber,
  Min,
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class OrderOptionsDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsString()
  @IsNotEmpty()
  optionName: string;

  @IsNumber()
  @Min(0)
  extraPrice: number;
}

export class CreateOrderItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderOptionsDto)
  @IsOptional()
  options?: OrderOptionsDto[];
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}

@Exclude()
export class OrderItemResponseDto {
  @Expose() itemId: string;
  @Expose() name: string;
  @Expose() imageUrl: string;
  @Expose() quantity: number;
  @Expose() unitPrice: number;
  @Expose() unit: string;
  @Expose() totalPrice: number;
  @Expose() options?: OrderOptionsDto[];
}
