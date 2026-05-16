import { DeliveryType } from "@/features/order/constants/order.constant";
import { Table, TableStatus } from "./types";
import { useRouter } from "next/navigation";

type Ctx = {
  router: ReturnType<typeof useRouter>;
  setTable: (table: Table) => void;
  setMethod?: (method: DeliveryType) => void;
};

type TableActionMap = Record<TableStatus, (table: Table, ctx: Ctx) => void>;

const TABLE_ACTION_MAP: TableActionMap = {
  available: (table, ctx) => {
    ctx.setTable(table);
    ctx.setMethod?.("DINE_IN");
    ctx.router.push(`/staff/orders/new`);
  },

  occupied: (table, ctx) => {
    ctx.router.push(`/staff/orders/${table.id}`);
  },

  reserved: (table) => {
    // future: check-in flow
    console.log("reserved table", table);
  },

  cleaning: () => {
    // block interaction
  },

  maintenance: () => {
    // block interaction
  },

  disabled: () => {
    // block interaction
  },
};

export const handleTableAction = (table: Table, ctx: Ctx) => {
  return TABLE_ACTION_MAP[table.status]?.(table, ctx);
};
