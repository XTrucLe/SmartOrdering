import { plainToInstance } from 'class-transformer';
import { MenuSectionResponseDto } from '../dtos/menu-sections/menu-section.response.dto';
import { MenuSection } from '../entities/menu-section.entity';

export class MenuSectionMapper {
  static toResponseDto(menuSection: MenuSection): MenuSectionResponseDto {
    return plainToInstance(MenuSectionResponseDto, menuSection, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseDtoList(
    menuSections: MenuSection[],
  ): MenuSectionResponseDto[] {
    return menuSections.map((section) => this.toResponseDto(section));
  }
}
