import { plainToInstance } from 'class-transformer';
import { MenuResponseDto } from '../dtos/menus/menu.response.dto';
import { Menu } from '../entities/menu.entity';

export function toMenuResponseDto(menu: Menu): MenuResponseDto {
  return plainToInstance(MenuResponseDto, menu, {
    excludeExtraneousValues: true,
  });
}

export function toMenuResponseDtos(menus: Menu[]): MenuResponseDto[] {
  return menus.map((menu) => toMenuResponseDto(menu));
}
