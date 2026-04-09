import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthResponseDto, JwtPayload, LoginDto } from '../dtos/auth.dto';
import { OwnerRegisterDto } from '../dtos/account.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
