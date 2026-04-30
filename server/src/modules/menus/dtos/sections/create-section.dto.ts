import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSectionItemDto } from '../section-items/create-section-item.dto';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  displayOrder: number;

  @IsOptional()
  @Type(() => CreateSectionItemDto)
  items?: CreateSectionItemDto[];
}
