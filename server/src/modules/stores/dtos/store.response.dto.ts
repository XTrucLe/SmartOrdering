import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StoreResponseDto {
  @Expose() id: string;
  @Expose() slug: string;
  @Expose() name: string;
  @Expose() description?: string;
}
