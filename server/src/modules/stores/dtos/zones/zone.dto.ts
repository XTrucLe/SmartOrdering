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

export class ZoneResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
}
