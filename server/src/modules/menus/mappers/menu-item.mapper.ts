import { plainToInstance } from 'class-transformer';
import { MenuItemResponseDto } from '../dtos/menu-items/menu-item.response.dto';
import { MenuItem } from '../entities/menu-item.entity';

export class MenuItemMapper {
  static toResponseDto(menuItem: MenuItem): MenuItemResponseDto {
    return plainToInstance(MenuItemResponseDto, menuItem, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseDtoList(menuItems: MenuItem[]): MenuItemResponseDto[] {
    return menuItems.map((item) => this.toResponseDto(item));
  }
}
