"use client";
import { use, useEffect } from "react";
import { storeService } from "@/services/store";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store_slug: string }>;
}) {
  const { store_slug } = use(params);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeData = await storeService.getStores(store_slug);
        console.log("Fetched store data:", storeData);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };
    fetchStoreData();
  }, [store_slug]);

  return <div>{children}</div>;
}
