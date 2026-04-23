export enum StoreRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

export const RoleHierarchy: Record<StoreRole, number> = {
  [StoreRole.OWNER]: 0,
  [StoreRole.MANAGER]: 1,
  [StoreRole.STAFF]: 2,
};
