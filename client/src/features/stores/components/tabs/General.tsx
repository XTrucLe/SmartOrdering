"use client";

import { formatDate } from "@/lib/utils/date-time";
import { useStore } from "../../store/useStore";
import { cn } from "@/lib/utils";

function GeneralTab() {
  const { currentStore: store } = useStore();

  if (!store) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col flex-1 p-6 px-8 gap-4">
      <div className="flex flex-row justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold">{store.name}</h2>
          <p className="text-sm text-muted-foreground">Slug: {store.slug}</p>
        </div>
        <div
          className={cn(
            "flex flex-row gap-2 items-center border px-3 py-1 rounded-full",
            store.isActive
              ? "border-success text-success"
              : "border-error text-error",
          )}
        >
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              store.isActive ? "bg-success" : "bg-error",
            )}
          />
          <p className="text-md font-semibold">
            {store.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
      <div className="flex flex-col h-full mb-2">
        <p className="text-sm text-muted-foreground">Description:</p>
        <p className="text-md indent-1">
          {store.description || "No description provided."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Phone:</p>
          <p className="text-md">{store.phone}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Email:</p>
          <p className="text-md">{store.email || "No email provided."}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Address:</p>
          <p className="text-md">
            {store.streetAddress}, {store.ward}, {store.province}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Longitude:</p>
          <p className="text-md">{store.longitude}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Latitude:</p>
          <p className="text-md">{store.latitude}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Created at:</p>
          <p className="text-md">
            {store.createdAt
              ? formatDate(store.createdAt.toString(), {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "No date provided."}
          </p>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
}

export default GeneralTab;
