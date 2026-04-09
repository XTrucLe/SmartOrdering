import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';

export const CurrentUser = createParamDecorator(
  <K extends keyof JwtPayload>(data: K, ctx: ExecutionContext): JwtPayload[K] | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new UnauthorizedException();
    }

    return data ? user[data] : user;
  },
);
