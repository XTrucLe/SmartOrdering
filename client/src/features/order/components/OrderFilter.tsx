"use client";

import * as React from "react";
import { FilterPopover } from "@/components/common/FilterPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABEL } from "../constants/order.constant";

export type FilterValue = {
  status: string[];
  time: string;
};

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABEL)
  .slice(0, 3)
  .map(([value, label]) => ({
    value,
    label,
  }));
const TIME_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Last 5 min", value: "5" },
  { label: "Last 10 min", value: "10" },
  { label: "Last 30 min", value: "30" },
  { label: "Last 1 hour", value: "60" },
];

export default function OrderFilter({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const [local, setLocal] = React.useState(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setLocal(value);
  }, [value]);

  function toggleStatus(s: string) {
    setLocal((prev) => {
      const exists = prev.status.includes(s);
      return {
        ...prev,
        status: exists
          ? prev.status.filter((x) => x !== s)
          : [...prev.status, s],
      };
    });
  }

  function apply() {
    onChange(local);
    setOpen(false);
  }

  function reset() {
    const next = { status: [], time: "ALL" };
    setLocal(next);
    onChange(next);
    setOpen(false);
  }

  const activeCount = local.status.length + (local.time !== "ALL" ? 1 : 0);

  return (
    <FilterPopover
      open={open}
      setOpen={setOpen}
      triggerLabel="Filter"
      activeCount={activeCount}
      footer={
        <>
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:underline"
          >
            Reset
          </button>

          <Button size="sm" onClick={apply}>
            Apply
          </Button>
        </>
      }
    >
      <div>
        <p className="mb-2 text-sm font-medium">Status</p>
        <div className="space-y-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={value}
                checked={local.status.includes(value)}
                onCheckedChange={() => toggleStatus(value)}
              />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Time</p>
        <RadioGroup
          value={local.time}
          onValueChange={(v) => setLocal((prev) => ({ ...prev, time: v }))}
        >
          {TIME_OPTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </FilterPopover>
  );
}
