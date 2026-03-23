import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/accounts/constants/role.constant';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
