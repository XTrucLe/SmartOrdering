import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from '../accounts/dtos/account.dto';
import {
  CustomerLoginDto,
  StaffLoginDto,
  VeryfyOtpDto,
} from './dtos/login.dto';
import { AuthResponseDto, JwtPayload } from './dtos/auth.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ChangePasswordDto,
  VerifyStaffOtpDto,
  ResetPasswordDto,
} from './dtos/password.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerStaff(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(createAccountDto);
  }

  @Post('login')
  async loginStaff(
    @Body() staffLoginDto: StaffLoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.staffLogin(staffLoginDto);
  }

  @Post('customer/otp/send')
  async sendCustomerOtp(
    @Body() customerLoginDto: CustomerLoginDto,
  ): Promise<void> {
    return this.authService.sendOTP(customerLoginDto);
  }

  @Post('customer/otp/verify')
  async verifyCustomerOtp(
    @Body() verifyOtpDto: VeryfyOtpDto,
  ): Promise<AuthResponseDto> {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password/change')
  async changeStaffPassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.sub, changePasswordDto);
  }

  @Post('password/forgot')
  async forgotStaffPassword(@Body('email') email: string): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('password/verify-otp')
  async verifyForgotPasswordOtp(
    @Body() verifyOtpDto: VerifyStaffOtpDto,
  ): Promise<string> {
    const { email, otp } = verifyOtpDto;
    return this.authService.verifyFogotPasswordOtp(email, otp);
  }

  @Patch('password/reset')
  async resetStaffPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
