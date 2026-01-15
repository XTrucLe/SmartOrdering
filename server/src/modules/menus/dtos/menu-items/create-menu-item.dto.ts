import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  displayOrder?: number;
}
