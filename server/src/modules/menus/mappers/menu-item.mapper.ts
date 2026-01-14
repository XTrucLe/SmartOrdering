import { plainToInstance } from 'class-transformer';
import { MenuItemResponseDto } from '../dtos/menu-items/menu-item.response.dto';
import { MenuItem } from '../entities/menu-item.entity';

export function toMenuItemResponseDto(item: MenuItem): MenuItemResponseDto {
  return plainToInstance(MenuItemResponseDto, item, {
    excludeExtraneousValues: true,
  });
}

export function toMenuItemResponseDtos(
  items: MenuItem[],
): MenuItemResponseDto[] {
  return plainToInstance(MenuItemResponseDto, items, {
    excludeExtraneousValues: true,
  });
}
