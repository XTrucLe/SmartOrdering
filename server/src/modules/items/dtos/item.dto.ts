import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OptionGroupDto } from './option-group.dto';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

@Exclude()
export class ItemDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() imageUrl: string;
  @Expose() isAvailable: boolean;
  @Expose() displayOrder: number;
  @Expose() basePrice: number;
  @Expose() createdAt: Date;
  @Expose()
  @Type(() => OptionGroupDto)
  optionGroup?: OptionGroupDto[];
}
