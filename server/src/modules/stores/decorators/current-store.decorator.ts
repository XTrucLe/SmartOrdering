import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { StoreInfo } from '../dtos/stores/store-info.dto';
import { Request } from 'express';
import { JwtPayload } from '@/modules/auth/dtos/auth.dto';

export const CurrentStore = createParamDecorator(
  (data: StoreInfo, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user || !user.store) {
      throw new ForbiddenException('No active store found for the user.');
    }

    return user.store;
  },
);
