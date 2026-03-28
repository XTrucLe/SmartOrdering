import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthResponseDto } from './dtos/auth.dto';
import { OwnerRegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  loginStaff(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('owner-register')
  async registerOwner(@Body() dto: OwnerRegisterDto): Promise<string> {
    await this.authService.register(dto);
    return 'Account created successfully, please wait for admin approval.';
  }
}
