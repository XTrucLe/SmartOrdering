import { IsArray, IsUUID } from 'class-validator';

export class UpdateSectionOrderDto {
  @IsArray()
  @IsUUID('4', { each: true })
  sectionIds: string[];
}
