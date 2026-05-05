import { StoreRole } from "./member";

export type Store = {
  id: string;
  slug: string;
  name: string;
  phone: string;
  email?: string;
  description?: string;
  status: StoreStatus;
  streetAddress: string;
  ward: string;
  province: string;
  role?: StoreRole;
  longitude?: number;
  latitude?: number;
  createdAt?: Date;
};

export type StoreStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export type StoreCreate = Omit<Store, "id" | "createdAt">;

export type StoreUpdate = Partial<StoreCreate>;
