import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MenuStatus } from '../constants/menu.constant';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsEnum(MenuStatus)
  status: MenuStatus;

  @IsOptional()
  @IsString({ each: true })
  tags: string[];
}
