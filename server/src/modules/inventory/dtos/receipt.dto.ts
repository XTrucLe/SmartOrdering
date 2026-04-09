import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReceiptItemDto {
  @IsString()
  ingredientId: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitCost: number;
}

export class CreateReceiptDto {
  @IsNotEmpty()
  @IsString()
  supplier: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  deliverer: string;

  @IsNotEmpty()
  @IsString()
  accepter: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  items: ReceiptItemDto[];
}

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {}

@Exclude()
export class ReceiptItemResponseDto {
  @Expose() name: string;
  @Expose() quantity: number;
  @Expose() unit: string;
  @Expose() unitCost: number;
  @Expose() totalCost: number;
}

@Exclude()
export class ReceiptResponseDto {
  @Expose() id: number;
  @Expose() code: string;
  @Expose() storeName: string;
  @Expose() supplier: string;
  @Expose() phoneNumber: string;
  @Expose() deliverer: string;
  @Expose() accepter: string;
  @Expose() status: string;
  @Expose() totalCost: number;
  @Expose() receiptDate: Date;
  @Expose()
  @Type(() => ReceiptItemResponseDto)
  items: ReceiptItemResponseDto[];
}
