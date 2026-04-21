export type Store = {
    id: string;
    slug: string;
    name: string;
    phone: string;
    email?: string;
    description?: string;
    isActive: boolean;
    streetAddress: string;
    ward: string;
    province: string;
    longitude?: number;
    latitude?: number;
    createdAt?: Date;
}

export type StoreCreate = Omit<Store, "id" | "createdAt">;

export type StoreUpdate = Partial<StoreCreate>;