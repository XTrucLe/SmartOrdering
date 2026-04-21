"use client";

import { useState } from "react";
import { FilterPopover } from "@/components/common/FilterPopover";
import { useProductFilters } from "../store/productFilter";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const productFilterConfig = [
  {
    type: "radio",
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

export function ProductFilter() {
  const [open, setOpen] = useState(false);

  const filters = useProductFilters((s) => s.filters);
  const setFilter = useProductFilters((s) => s.setFilter);
  const toggleFilter = useProductFilters((s) => s.toggleFilter);
  const reset = useProductFilters((s) => s.reset);

  const activeCount = Object.values(filters).flat().length;

  return (
    <FilterPopover
      open={open}
      setOpen={setOpen}
      activeCount={activeCount}
      footer={
        <>
          <button className="text-sm text-muted-foreground" onClick={reset}>
            Clear
          </button>
          <button
            className="text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {productFilterConfig.map((group) => {
          const values = filters[group.key] || [];

          return (
            <div key={group.key} className="space-y-2">
              <p className="text-sm font-medium">{group.label}</p>

              {group.type === "checkbox" &&
                group.options.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.key}-${opt.value}`}
                      checked={values.includes(opt.value)}
                      onCheckedChange={() => toggleFilter(group.key, opt.value)}
                    />
                    <Label htmlFor={`${group.key}-${opt.value}`}>
                      {opt.label}
                    </Label>
                  </div>
                ))}

              {group.type === "radio" && (
                <RadioGroup
                  value={values[0]}
                  onValueChange={(val) => {
                    if (val === values[0]) {
                      setFilter({ [group.key]: [] });
                    } else {
                      setFilter({ [group.key]: [val] });
                    }
                  }}
                >
                  {group.options.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={opt.value}
                        id={`${group.key}-${opt.value}`}
                      />
                      <Label htmlFor={`${group.key}-${opt.value}`}>
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          );
        })}
      </div>
    </FilterPopover>
  );
}
