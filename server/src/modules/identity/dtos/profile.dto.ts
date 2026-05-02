import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../constants/profile.constant';

@Exclude()
export class CreateProfileDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Expose()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Expose()
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose()
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @Expose()
  @IsOptional()
  @IsString()
  ward?: string;

  @Expose()
  @IsOptional()
  @IsString()
  province?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}

@Exclude()
export class ProfileResponseDto {
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() gender: string;
  @Expose() phoneNumber: string;
  @Expose() email: string;
  @Expose() dateOfBirth: Date;
  @Expose() avatar: string;
  @Expose() streetAddress: string;
  @Expose() ward: string;
  @Expose() province: string;
  @Expose() globalRole: string;
  @Expose() createdAt: Date;
}

@Exclude()
export class ProfileSummaryDto {
  @Expose() id: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() avatar: string;
}
