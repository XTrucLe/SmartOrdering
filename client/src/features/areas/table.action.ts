import { DeliveryMethod } from "../order/types";
import { Table, TableStatus } from "./types";
import { useRouter } from "next/navigation";

type Ctx = {
  router: ReturnType<typeof useRouter>;
  setTable: (table: Table) => void;
  setMethod?: (method: DeliveryMethod) => void;
};

const createOrder = (table: Table, { router, setTable, setMethod }: Ctx) => {
  setTable(table);
  setMethod?.("DINE_IN");
  router.push(`/staff/orders/dine-in`);
};

const openOrder = (table: Table, ctx: Ctx) => {
  ctx.router.push(`/staff/orders/${table}`);
};

const TABLE_ACTION_MAP: Record<TableStatus, (table: Table, ctx: Ctx) => void> =
  {
    available: createOrder,
    occupied: openOrder,
    reserved: (t) => console.log("reservation", t),
    maintenance: () => {},
    cleaning: () => {},
    disabled: () => {},
  };

export const handleTableAction = (table: Table, ctx: Ctx) => {
  return TABLE_ACTION_MAP[table.status]?.(table, ctx);
};
