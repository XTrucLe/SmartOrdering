import { create } from "zustand";
import { BusinessHour, Store, StoreRole } from "../types";

interface StoreState {
  currentStore?: Store;
  businessHours: BusinessHour[];
  role?: StoreRole;

  setCurrentStore: (store: Store) => void;
  setRole: (role: StoreRole) => void;
  setBusinessHours: (hours: BusinessHour[]) => void;
}

export const useStore = create<StoreState>()((set) => ({
  currentStore: undefined,
  role: undefined,
  businessHours: [
    { day: "monday", open: "09:00", close: "18:00" },
    { day: "tuesday", open: "09:00", close: "18:00" },
    { day: "wednesday", open: "09:00", close: "18:00" },
    { day: "thursday", open: "09:00", close: "18:00" },
    { day: "friday", open: "09:00", close: "18:00" },
    { day: "saturday", open: "10:00", close: "16:00" },
    { day: "sunday", open: "10:00", close: "16:00" },
  ],

  setCurrentStore: (store) => set({ currentStore: store }),
  setRole: (role) => set({ role }),
  setBusinessHours: (hours) => set({ businessHours: hours }),
}));
