import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  unitMeasure: string;

  @IsNotEmpty()
  @IsString()
  unitCost: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}

@Exclude()
export class IngredientResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() unitMeasure: string;
  @Expose() unitCost: string;
  @Expose() isActive: boolean;
}
