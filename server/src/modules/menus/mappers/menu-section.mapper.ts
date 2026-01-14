import { plainToInstance } from 'class-transformer';
import { MenuSectionResponseDto } from '../dtos/menu-sections/menu-section.response.dto';
import { MenuSection } from '../entities/menu-section.entity';

export function toMenuSectionResponseDto(
  menuSection: MenuSection,
): MenuSectionResponseDto {
  return plainToInstance(MenuSectionResponseDto, menuSection, {
    excludeExtraneousValues: true,
  });
}

export function toMenuSectionResponseDtos(
  menuSections: MenuSection[],
): MenuSectionResponseDto[] {
  return plainToInstance(MenuSectionResponseDto, menuSections, {
    excludeExtraneousValues: true,
  });
}
