import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
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
