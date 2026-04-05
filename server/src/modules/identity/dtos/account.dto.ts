import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDto } from './profile.dto';
import { CreateStoreDto } from '@/modules/stores/dtos/stores/create-store.dto';

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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}

export class OwnerRegisterDto extends CreateAccountDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateStoreDto)
  store: CreateStoreDto;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @IsNotEmpty()
  newPassword: string;
}

@Exclude()
export class AccountResponseDto {
  @Expose() id: string;
  @Expose() email?: string;
  @Expose() phoneNumber?: string;
}
