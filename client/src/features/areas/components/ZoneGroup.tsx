"use client";

import { useMemo } from "react";

type ZoneGroupProps = {
  name: string;
  children: React.ReactNode;
};

export default function ZoneGroup({ name, children }: ZoneGroupProps) {
  const groupName = useMemo(() => {
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
  }, [name]);

  return (
    <div className="mb-4">
      <h2 className="mb-2 text-lg font-semibold">{groupName}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
        {children}
      </div>
    </div>
  );
}
