import { SetMetadata } from '@nestjs/common';
import { StoreRole } from '../constants/store-role.constant';

export const STORE_ROLE_KEY = 'store.role';

export const StoreRoles = (...roles: StoreRole[]) =>
  SetMetadata(STORE_ROLE_KEY, roles);
