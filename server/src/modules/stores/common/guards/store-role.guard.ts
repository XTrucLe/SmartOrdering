import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { STORE_ROLE_KEY } from '../decorators/store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';
import { StoreMemberService } from '../../member/member.service';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

@Injectable()
export class StoreRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly memberService: StoreMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user, headers } = req;
    const storeId = headers['x-store-id'] as string;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      req.storeContext = { id: storeId };
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<StoreRole[]>(STORE_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (storeId && user?.sub) {
      req.storeContext = await this.memberService.getStoreContext(user.sub, storeId);
    }

    if (!requiredRoles?.length) return true;

    const contextInfo = req.storeContext;
    if (!contextInfo) {
      throw new ForbiddenException({
        message: 'Store context is required to access this resource.',
        code: 'STORE_CONTEXT_REQUIRED',
      });
    }

    if (!requiredRoles.includes(contextInfo.role)) {
      throw new ForbiddenException({
        message: 'You do not have permission for this store resource.',
        code: 'STORE_PERMISSION_DENIED',
      });
    }

    req.contextRole = contextInfo.role;
    return true;
  }
}
