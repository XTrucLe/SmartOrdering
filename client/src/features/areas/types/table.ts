import { TABLE_STATUS } from "../constants/table";
import { Zone } from "./zone";

export interface Table {
  id: string;
  code: string;
  name: string;
  description?: string;
  capacity: number;
  status: TableStatus;
  createdAt?: string;
}

export interface TableGrouped extends Zone {
  tables: Table[];
}

export type TableCreate = {
  zoneId: string;
  name: string;
  capacity: number;
};

export type TableStatus = (typeof TABLE_STATUS)[keyof typeof TABLE_STATUS];

export type TableFilter = TableStatus | "All";
