export type Table = {
    id: string;
    code: string;
    name: string;
    description?: string;
    capacity: number;
    status: string;
    createdAt?: string;
}

export type TableCreate = {
    zoneId: string;
    name: string;
    capacity: number;
}