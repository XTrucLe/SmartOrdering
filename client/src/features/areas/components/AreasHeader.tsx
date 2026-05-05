import { Button } from "@/components/ui/button";
import { TABLE_STATUS, TableStatusMap } from "../constants/table";
import { TableFilter } from "../types";

export const AreasHeader = ({
  filter,
  setFilter,
}: {
  filter: TableFilter;
  setFilter: (filter: TableFilter) => void;
}) => {
  const statuses = Object.values(TABLE_STATUS);

  return (
    <div className="flex items-center gap-2 flex-nowrap pl-2 border-l overflow-auto no-scrollbar">
      <Button
        variant={filter === "All" ? "default" : "ghost"}
        onClick={() => setFilter("All")}
      >
        Tất cả
      </Button>

      {statuses.map((status) => (
        <Button
          key={status}
          variant={filter === status ? "default" : "ghost"}
          onClick={() => {
            setFilter(status);
          }}
        >
          {TableStatusMap[status]}
        </Button>
      ))}
    </div>
  );
};
