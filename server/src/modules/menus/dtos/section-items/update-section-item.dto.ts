import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionItemDto } from './create-section-item.dto';

export class UpdateSectionItemDto extends PartialType(CreateSectionItemDto) {}

export class UpdateSectionItemOrderDto {
  itemIds: string[];
}
