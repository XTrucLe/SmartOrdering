import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { StoreContextDto } from '../../store/dtos/store-context.dto';
import { Request } from 'express';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { StoreRole } from '../constants/store-role.constant';

export const CurrentStore = createParamDecorator(
  (data: keyof StoreContextDto | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<
        Request & { _contextRoles?: Record<string, StoreContextDto>; contextRole?: StoreRole }
      >();
    const user = request.user as JwtPayload;

    const contextId = request.headers['x-store-id'] as string;

    if (!contextId || !user?.sub) {
      throw new ForbiddenException(
        'You must be authenticated and have an active store context to access this resource.',
      );
    }

    const cacheKey = `ctx-role_${contextId}`;

    request._contextRoles = request._contextRoles || {};

    const contextInfo = !request._contextRoles[cacheKey] ? null : request._contextRoles[cacheKey];

    if (!contextInfo) {
      throw new ForbiddenException('No active store context found for the user.');
    }

    request._contextRoles[cacheKey] = contextInfo;

    return data ? contextInfo[data] : contextInfo;
  },
);
