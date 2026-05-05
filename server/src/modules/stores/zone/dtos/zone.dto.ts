import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateZoneDto extends CreateZoneDto {}

@Exclude()
export class ZoneResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() createdAt?: Date;
}
