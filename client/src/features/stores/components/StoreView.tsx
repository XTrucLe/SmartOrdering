"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import StoreHeader from "./StoreHeader";
import { HEADER_TABS } from "../constants/HeaderTab";

function StoreView() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Tabs className="gap-0" defaultValue={HEADER_TABS[0].value}>
        <StoreHeader />
        {HEADER_TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex flex-1 bg-card border-t-2 overflow-y-auto"
          >
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default StoreView;
