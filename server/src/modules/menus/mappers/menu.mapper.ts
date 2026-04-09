import { plainToInstance } from 'class-transformer';
import { MenuResponseDto } from '../dtos/menus/menu.response.dto';
import { Menu } from '../entities/menu.entity';

export class MenuMapper {
  static toResponseDto(menu: Menu): MenuResponseDto {
    return plainToInstance(MenuResponseDto, menu, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseDtoList(menus: Menu[]): MenuResponseDto[] {
    return menus.map((menu) => this.toResponseDto(menu));
  }
}
