import { Controller, Post, Body, HttpCode, Res, Req } from '@nestjs/common';
import { LoginDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async loginStaff(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const authData = await this.authService.login(dto);
    res.cookie('session-token', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
    });

    res.cookie('user-info', JSON.stringify({ ...authData.user, globalRole: authData.globalRole }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
    });

    res.cookie('refresh-token', authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600000,
      path: '/',
    });

    return { message: 'Login successful' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies['refresh-token'];
    const authData = await this.authService.refreshToken(refreshToken);

    res.cookie('session-token', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
    });

    res.cookie('user-info', JSON.stringify({ ...authData.user, globalRole: authData.globalRole }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
    });

    return { message: 'Token refreshed successfully' };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies['refresh-token'];
    console.log('logout: ', refreshToken);

    await this.authService.logoutByRefreshToken(refreshToken);

    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.clearCookie('session-token', cookieOptions);
    res.clearCookie('refresh-token', cookieOptions);
    res.clearCookie('user-info', { path: '/' });

    return { message: 'Logout successful' };
  }
}
