import { IsArray, IsUUID } from 'class-validator';

export class UpdateMenuSectionOrderDto {
  @IsArray()
  @IsUUID('4', { each: true })
  sectionIds: string[];
}
