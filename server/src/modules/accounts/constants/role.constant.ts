export enum Role {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export const ROLE_LEVELS = {
  [Role.GUEST]: 0,
  [Role.CUSTOMER]: 1,
  [Role.STAFF]: 2,
  [Role.MANAGER]: 3,
  [Role.OWNER]: 4,
  [Role.ADMIN]: 5,
};
