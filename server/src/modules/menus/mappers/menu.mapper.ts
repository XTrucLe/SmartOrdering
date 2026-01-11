import { plainToInstance } from 'class-transformer';
import { Menu } from '../entities/menu.entity';
import { MenuResponseDto } from '../dtos/menu.response.dto';

export function mapToMenuDto(menu: Menu): MenuResponseDto {
  return plainToInstance(MenuResponseDto, menu, {
    excludeExtraneousValues: true,
  });
}

export function mapToMenuDtos(menus: Menu[]): MenuResponseDto[] {
  return menus.map((menu) =>
    plainToInstance(MenuResponseDto, menu, {
      excludeExtraneousValues: true,
    }),
  );
}
