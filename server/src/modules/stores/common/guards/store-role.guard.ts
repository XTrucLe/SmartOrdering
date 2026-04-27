import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { STORE_ROLE_KEY } from '../decorators/store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';
import { StoreMemberService } from '../../member/member.service';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { StoreContextDto } from '../../store/dtos/store-context.dto';

@Injectable()
export class StoreRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly memberService: StoreMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request & { _contextRoles?: Record<string, StoreContextDto>; contextRole?: StoreRole }
      >();
    const requiredRoles = this.reflector.getAllAndOverride<StoreRole[]>(STORE_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const user = request.user as JwtPayload;
    const contextId = request.headers['x-store-id'] as string;

    if (!contextId || !user?.sub) {
      throw new ForbiddenException(
        'You must be authenticated and have an active store context to access this resource.',
      );
    }

    const cacheKey = `ctx-role_${contextId}`;

    request._contextRoles = request._contextRoles || {};

    const contextInfo = !request._contextRoles[cacheKey]
      ? await this.memberService.getStoreContext(user?.sub, contextId)
      : request._contextRoles[cacheKey];

    console.log(contextInfo);

    if (!contextInfo) {
      throw new ForbiddenException('No active store context found for the user.');
    }

    request._contextRoles[cacheKey] = contextInfo;

    if (!requiredRoles.includes(contextInfo.role)) {
      throw new ForbiddenException('You do not have the required role to access this resource.');
    }

    request.contextRole = contextInfo.role;

    return true;
  }
}
