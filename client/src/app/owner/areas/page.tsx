"use client";

import { Zone } from "@/features/areas/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EditableField } from "@/components/common/EditableField";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// mock data
const zones: Zone[] = [
  {
    id: "1",
    name: "Zone 1",
    tables: [
      {
        id: "t1",
        code: "T001",
        name: "Table 1",
        capacity: 4,
        status: "available",
      },
      {
        id: "t2",
        code: "T002",
        name: "Table 2",
        capacity: 6,
        status: "occupied",
      },
      {
        id: "t3",
        code: "T003",
        name: "Table 3",
        capacity: 2,
        status: "available",
      },
    ],
  },
  {
    id: "2",
    name: "Zone 2",
    tables: [
      {
        id: "t4",
        code: "T004",
        name: "Table 4",
        capacity: 4,
        status: "available",
      },
    ],
  },
];

export default function TablesPage() {
  const [editable, setEditable] = useState(false);

  const handleEdit = () => setEditable(!editable);

  const handleDelete = (id: string) => {
    const newZones = zones.filter((zone) => zone.id !== id);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tables</h1>
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button className="px-3 py-2 bg-primary  rounded-lg">
              Manage Zone
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full sm:w-120 h-screen">
            <DrawerHeader className="border-b">
              <DrawerTitle>Manage Zone</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-2">
              {zones.map((zone) => (
                <div key={zone.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <EditableField
                      value={zone.name}
                      onChange={() => {}}
                      editable={editable}
                    />
                    <div className="gap-2 flex">
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        Sửa
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Xóa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                          </DialogHeader>
                          <p className="text-md first-letter:capitalize indent-1.5">
                            Bạn có chắc chắn muốn xóa khu vực này không?
                            <br />
                            <br />
                            <p className="text-sm text-error">
                              Hành động này không thể hoàn tác và có thể xóa
                              toàn bộ dữ liệu liên quan đến khu vực này.
                            </p>
                          </p>

                          <div className="mt-4 flex justify-end gap-2">
                            <Button variant="destructive" onClick={() => {}}>
                              Chắc chắn xóa
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="space-y-6">
        {zones.map((zone) => (
          <div key={zone.id} className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-medium">{zone.name}</h2>
              <button className="text-sm text-muted-foreground">+ Add</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {zone.tables.map((table) => (
                <div key={table.id} className="border rounded-xl p-3 space-y-2">
                  <div className="font-medium">{table.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {table.capacity} seats
                  </div>

                  <div
                    className={`text-xs px-2 py-1 rounded w-fit ${
                      table.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {table.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
