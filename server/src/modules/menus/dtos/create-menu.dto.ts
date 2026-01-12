import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { MenuStatus } from '../constants/menu.constant';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;

  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
