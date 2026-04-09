import { IsString, IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@Exclude()
export class CategoryResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() displayOrder: number;
  @Expose() isActive: boolean;
  @Expose() createdAt: Date;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products?: ProductDto[];
}
