export enum StoreRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

export const RoleHierarchy: Record<StoreRole, number> = {
  [StoreRole.OWNER]: 3,
  [StoreRole.MANAGER]: 2,
  [StoreRole.STAFF]: 1,
};
