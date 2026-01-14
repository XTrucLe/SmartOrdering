import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuItemDto } from '../menu-items/create-menu-item.dto';

export class CreateMenuSectionDto {
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
}

export class CreateMenuSectionWithItemsDto extends CreateMenuSectionDto {
  @IsOptional()
  items?: CreateMenuItemDto[];
}
