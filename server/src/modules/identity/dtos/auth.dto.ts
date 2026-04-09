import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { Role } from '../constants/role.constant';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CustomerLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty()
  email: string;
}

export class VerifyStaffOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải từ 8 ký tự' })
  @IsNotEmpty()
  newPassword: string;
}

export class AuthUser {
  id: string;
  username: string;
}

export class JwtPayload {
  sub: string;
  username: string;
  globalRole: Role;
  store?: StoreInfo;
}

export class AuthResponseDto {
  accessToken: string;
  globalRole: Role;
  user?: AuthUser;
  store?: StoreInfo[];
  activeStore?: StoreInfo;
}
