import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { MenuType } from '../../constants/menus.constant';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(MenuType)
  type: MenuType;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
