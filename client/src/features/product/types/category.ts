

export type Category = {
    id: string;

    name: string;
    description?: string;

    displayOrder: number;
    isActive: boolean;

    createdAt?: string;
};

export type CategoryForm = {
    name: string;
    description?: string;
}