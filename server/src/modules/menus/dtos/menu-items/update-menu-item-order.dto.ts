import { IsArray, IsUUID } from 'class-validator';

export class UpdateMenuItemOrderDto {
  @IsArray()
  @IsUUID('4', { each: true })
  itemIds: string[];
}
