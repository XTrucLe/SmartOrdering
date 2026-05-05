import { create } from "zustand";
import { User } from "./type/user";
import { authService } from "./services/auth";
import { Store } from "../stores/types";

interface AuthState {
  user: User | null;
  accessibleStores: Store[] | null;
  store: Store | null;

  setStore: (store: Store) => void;
  setSession: (user: User, accessibleStores: Store[]) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessibleStores: null,
  store: null,

  setStore: (store) => set({ store }),
  setSession: (user, accessibleStores) =>
    set({ user, accessibleStores, store: null }),

  clearSession: () => {
    authService.logout();
    set({ user: null, accessibleStores: null, store: null });
  },
}));
