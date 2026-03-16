import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    { name: "ui-storage" },
  ),
);
