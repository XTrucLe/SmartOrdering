import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class StoreResponseDto {
  @Expose() id: string;
  @Expose() slug: string;
  @Expose() name: string;
  @Expose() phone: string;
  @Expose() email?: string;
  @Expose() description?: string;
  @Expose() status: string;
  @Expose() streetAddress: string;
  @Expose() ward: string;
  @Expose() district: string;
  @Expose() province: string;
  @Expose() longitude?: number;
  @Expose() latitude?: number;

  @Expose() role: string;
  @Expose() createdAt: Date;
}

@Exclude()
export class StoreShortResponseDto {
  @Expose() id: string;
  @Expose() slug: string;
  @Expose() name: string;
}
