"use client";

import { Input } from "@/components/ui/input";
import { useStore } from "../../store/useStore";

const WEEK_DAYS = [
  { label: "Thứ Hai", value: "monday" },
  { label: "Thứ Ba", value: "tuesday" },
  { label: "Thứ Tư", value: "wednesday" },
  { label: "Thứ Năm", value: "thursday" },
  { label: "Thứ Sáu", value: "friday" },
  { label: "Thứ Bảy", value: "saturday" },
  { label: "Chủ Nhật", value: "sunday" },
];

function OperationsTab() {
  const { businessHours, setBusinessHours } = useStore();

  const handleUpdateBusinessHours = (
    day: string,
    type: "open" | "close",
    value: string,
  ) => {
    setBusinessHours(
      businessHours.map((h) =>
        h.day === day
          ? {
              ...h,
              [type]: value,
            }
          : h,
      ),
    );
  };

  return (
    <div className="flex flex-col flex-1 p-6 px-8 gap-4">
      <h2 className="text-2xl font-semibold border-b pb-4">Operation Setup</h2>
      <div className="flex flex-col h-full mb-2">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-md font-semibold"> Business Hours</p>
            <div className="flex flex-col gap-2 mt-2 mx-8">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day.value}
                  className="flex flex-row items-center gap-4"
                >
                  <span className="w-20 text-sm font-semibold">
                    {day.label}
                  </span>
                  <div className="flex flex-row ">
                    <Input
                      key={`open-selector-${day.value}`}
                      type="time"
                      className="border rounded-md px-2 py-1 text-sm"
                      value={
                        businessHours.find((h) => h.day === day.value)?.open
                      }
                      onChange={(e) =>
                        handleUpdateBusinessHours(
                          day.value,
                          "open",
                          e.target.value,
                        )
                      }
                    />
                    <span className="mx-2">-</span>
                    <Input
                      key={`close-selector-${day.value}`}
                      type="time"
                      className="border rounded-md px-2 py-1 text-sm"
                      value={
                        businessHours.find((h) => h.day === day.value)?.close
                      }
                      onChange={(e) =>
                        handleUpdateBusinessHours(
                          day.value,
                          "close",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationsTab;

// Operations

// [ Business Hours ]
// - Monday: 8:00 - 22:00
// - ...

// [ Order Settings ]
// ☑ Auto accept orders
// ☑ Allow cancel

// [ Dine-in ]
// ☑ Enable tables
