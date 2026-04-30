import { plainToInstance } from 'class-transformer';
import { SectionResponseDto } from '../dtos/sections/section.response.dto';
import { Section } from '../entities/section.entity';

export class SectionMapper {
  static toResponseDto(section: Section): SectionResponseDto {
    return plainToInstance(SectionResponseDto, section, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseDtoList(menuSections: Section[]): SectionResponseDto[] {
    return menuSections.map((section) => this.toResponseDto(section));
  }
}
