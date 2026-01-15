import { Exclude, Expose, Type } from 'class-transformer';
import { MenuSectionResponseDto } from '../menu-sections/menu-section.response.dto';

@Exclude()
export class MenuResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() type: string;
  @Expose() imageUrl?: string;

  @Expose()
  @Type(() => MenuSectionResponseDto)
  menuSections: MenuSectionResponseDto[];
}
