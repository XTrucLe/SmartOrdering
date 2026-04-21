"use client";

import StoreView from "@/features/stores/components/StoreView";
import { useStore } from "@/features/stores/store/useStore";
import { useEffect } from "react";

function StorePage() {
  const { setCurrentStore } = useStore();

  useEffect(() => {
    setCurrentStore({
      id: "1",
      slug: "store-1",
      name: "Store 1",
      description: "This is store 1",
      phone: "123-456-7890",
      streetAddress: "123 Main St",
      ward: "Anytown",
      province: "Anystate",
      isActive: true,
      createdAt: new Date(),
    });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <StoreView />
    </div>
  );
}

export default StorePage;
