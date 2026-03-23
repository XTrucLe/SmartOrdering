import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role } from '../constants/role.constant';
import { CreateProfileDto } from 'src/modules/profiles/dtos/create-profile.dto';

@Exclude()
export class CreateAccountDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsEnum(Role)
  role?: Role;

  @Expose()
  @IsNotEmpty()
  profile: CreateProfileDto;
}
