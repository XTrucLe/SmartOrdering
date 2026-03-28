import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthResponseDto, JwtPayload } from './dtos/auth.dto';
import { OwnerRegisterDto } from './dtos/register.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  loginStaff(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Post('select-store')
  async selectStore(
    @CurrentUser() user: JwtPayload,
    @Body('storeId') storeId: string,
  ): Promise<AuthResponseDto> {
    return this.authService.loginWithStore(user.sub, storeId);
  }

  @Post('owner-register')
  async registerOwner(@Body() dto: OwnerRegisterDto): Promise<string> {
    await this.authService.register(dto);
    return 'Account created successfully, please wait for admin approval.';
  }
}
