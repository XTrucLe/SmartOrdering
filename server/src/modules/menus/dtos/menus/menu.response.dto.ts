import { Exclude, Expose, Type } from 'class-transformer';
import { SectionResponseDto } from '../sections/section.response.dto';

@Exclude()
export class MenuResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() type: string;
  @Expose() imageUrl?: string;

  @Expose()
  @Type(() => SectionResponseDto)
  sections: SectionResponseDto[];
}
