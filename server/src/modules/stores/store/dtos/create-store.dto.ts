import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class CreateStoreDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
  })
  slug?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  ward: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  longitude?: number;

  @IsOptional()
  @IsString()
  latitude?: number;
}
