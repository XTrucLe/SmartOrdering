import { Table } from "./table";

export type Zone = {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    tables: Table[];
}

export type ZoneCreate = {
    name: string;
    description: string;
}