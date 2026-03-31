import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '@/modules/auth/dtos/auth.dto';
import { STORE_ROLE_KEY } from '../decorators/store-role.decorator';

@Injectable()
export class StoreRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      STORE_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const user = request.user as JwtPayload;
    const storeRole = user?.store?.role;

    if (!storeRole || !requiredRoles.includes(storeRole)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
    return true;
  }
}
