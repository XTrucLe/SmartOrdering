import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@Exclude()
export class StaffLoginDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CustomerLoginDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;
}

export class VeryfyOtpDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  otp: string;
}
