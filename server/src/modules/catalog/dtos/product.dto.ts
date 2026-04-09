import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

@Exclude()
export class ProductDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() imageUrl: string;
  @Expose() unit: string;
  @Expose() displayOrder: number;
  @Expose() isActive: boolean;
  @Expose() createdAt: Date;
}
