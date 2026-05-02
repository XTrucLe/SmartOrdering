export type User = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  avatar: string;
  streetAddress: string;
  ward: string;
  province: string;
  globalRole: GlobalRole;
  createdAt: string;
};

export type GlobalRole = "admin" | "user";

export const GLOBAL_ROLES: GlobalRole[] = ["admin", "user"];
