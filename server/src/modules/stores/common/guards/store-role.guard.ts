import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { STORE_ROLE_KEY } from '../decorators/store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';

@Injectable()
export class StoreRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndOverride<StoreRole[]>(STORE_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    if (!request.user) {
      throw new ForbiddenException('User not authenticated.');
    }

    const user = request.user as JwtPayload;

    if (!user.store) {
      throw new ForbiddenException('User does not have a store role.');
    }
    const storeRole = user.store.role;

    if (!storeRole) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

    const hasPermission = requiredRoles.includes(storeRole);

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

    return true;
  }
}
