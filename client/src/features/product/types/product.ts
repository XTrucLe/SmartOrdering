import { Category } from "./category";

export type Product = {
    id: string;
    name: string;
    description?: string;
    imageUrl: string;

    unit: string;
    displayOrder: number;
    categoryCount?: number;
    categories?: Category[];

    isActive: boolean;
    createdAt: string;
};

export type ProductForm = {
    name: string;
    description?: string;
    imageUrl: string;

    categoryIds: string[];
    unit: string;
};