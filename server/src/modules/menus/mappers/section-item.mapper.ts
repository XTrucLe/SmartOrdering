import { plainToInstance } from 'class-transformer';
import { SectionItem } from '../entities/section-item.entity';
import { SectionItemDto } from '../dtos/section-items/section-item-response.dto';

export class SectionItemMapper {
  static toDto(SectionItem: SectionItem): SectionItemDto {
    return plainToInstance(SectionItemDto, SectionItem, {
      excludeExtraneousValues: true,
    });
  }

  static toDtos(SectionItems: SectionItem[]): SectionItemDto[] {
    return SectionItems.map((item) => this.toDto(item));
  }
}
