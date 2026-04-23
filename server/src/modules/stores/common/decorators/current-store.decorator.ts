import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { StoreContextDto } from '../../store/dtos/store-context.dto';
import { Request } from 'express';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';

export const CurrentStore = createParamDecorator(
  (data: keyof StoreContextDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user || !user.store) {
      throw new ForbiddenException('No active store found for the user.');
    }

    if (data) {
      return user.store[data];
    }

    return user.store;
  },
);
