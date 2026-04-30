import { Expose, Type } from 'class-transformer';
import { SectionItemDto } from '../section-items/section-item-response.dto';

export class SectionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  displayOrder?: number;

  @Expose({ name: 'sectionItems' })
  @Type(() => SectionItemDto)
  items: SectionItemDto[];
}
