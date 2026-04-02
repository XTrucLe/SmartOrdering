import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';

export class CreateIngredientDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  baseUnit: string;

  @IsNotEmpty()
  @IsString()
  importUnit: string;

  @IsNotEmpty()
  @IsString()
  conversionRate: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}

@Exclude()
export class IngredientResponseDto {
  @Expose() id: string;
  @Expose() code: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() baseUnit: string;
  @Expose() importUnit: string;
  @Expose() conversionRate: string;
  @Expose() stockQty: string;
  @Expose() isActive: boolean;
}
