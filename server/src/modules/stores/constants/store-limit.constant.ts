import { StoreRole } from './store-role.constant';

export const StoreMaxMembers: Record<StoreRole, number> = {
  [StoreRole.OWNER]: 1,
  [StoreRole.MANAGER]: 10,
  [StoreRole.STAFF]: 25,
};
