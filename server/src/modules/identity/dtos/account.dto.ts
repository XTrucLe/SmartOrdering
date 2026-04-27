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

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}

export class CreateCustomerDto {
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
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
