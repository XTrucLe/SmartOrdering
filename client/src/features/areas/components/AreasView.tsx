"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableFilter, TableGrouped } from "../types";
import { getAreas } from "../areas.service";
import ZoneGroup from "./ZoneGroup";
import TableNode from "./TableNode";
import { AreasHeader } from "./AreasHeader";
import { Button } from "@/components/ui/button";
import { handleTableAction } from "../table.action";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/features/order/order.store";

export default function AreasView() {
  const router = useRouter();
  const [areas, setAreas] = useState<TableGrouped[]>([]);
  const [filter, setFilter] = useState<TableFilter>("All");
  const { setTable, setMethod } = useOrderStore();

  useEffect(() => {
    getAreas().then(setAreas);
  }, []);

  const filteredAreas = useMemo(() => {
    return areas
      .map((area) => ({
        ...area,
        tables: area.tables.filter(
          (table) => filter === "All" || table.status === filter,
        ),
      }))
      .filter((area) => area.tables.length > 0);
  }, [areas, filter]);

  const handleClickTable = (table: Table) => {
    handleTableAction(table, { router, setTable, setMethod });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row space-x-2 border-b p-4 bg-card/40 items-center overflow-hidden w-full">
        <Button variant="outline" className="mr-2 shrink-0">
          + Đem về
        </Button>
        <AreasHeader filter={filter} setFilter={setFilter} />
      </div>
      <div className="p-4 pt-2">
        {filteredAreas.map((area) => (
          <ZoneGroup key={area.name} name={area.name}>
            {area.tables.map((table) => (
              <TableNode
                key={table.id}
                table={table}
                onClick={handleClickTable}
              />
            ))}
          </ZoneGroup>
        ))}
      </div>
    </div>
  );
}
