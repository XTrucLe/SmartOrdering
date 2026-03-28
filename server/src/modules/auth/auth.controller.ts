import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAccountDto } from '../accounts/dtos/account.dto';
import {
  // CustomerLoginDto,
  StaffLoginDto,
  // VerifyOtpDto,
} from './dtos/login.dto';
import { AuthResponseDto, JwtPayload } from './dtos/auth.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
  ChangePasswordDto,
  // VerifyStaffOtpDto,
  // ResetPasswordDto,
} from './dtos/password.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  loginStaff(@Body() dto: StaffLoginDto): Promise<AuthResponseDto> {
    return this.authService.staffLogin(dto);
  }

  // @Post('staff/register')
  // registerStaff(@Body() dto: CreateAccountDto): Promise<AuthResponseDto> {
  //   return this.authService.register(dto);
  // }

  // @Post('customer/otp/send')
  // sendCustomerOtp(@Body() dto: CustomerLoginDto): Promise<void> {
  //   return this.authService.sendOtp(dto);
  // }

  // @Post('customer/otp/verify')
  // verifyCustomerOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseDto> {
  //   return this.authService.verifyOtp(dto);
  // }

  @UseGuards(JwtGuard)
  @Patch('staff/password/change')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.sub, dto);
  }

  // @Post('staff/password/forgot')
  // forgotPassword(@Body('email') email: string): Promise<void> {
  //   return this.authService.forgotPassword(email);
  // }

  // @Post('staff/password/verify-otp')
  // verifyForgotPasswordOtp(@Body() dto: VerifyStaffOtpDto): Promise<string> {
  //   return this.authService.verifyForgotPasswordOtp(dto.email, dto.otp);
  // }

  // @Patch('staff/password/reset')
  // resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
  //   return this.authService.resetPassword(dto);
  // }
}
