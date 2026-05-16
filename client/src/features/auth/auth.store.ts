import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessibleStores: null,
      store: null,

      setStore: (store) => set({ store }),
      setSession: (user, accessibleStores) => set({ user, accessibleStores }),
      clearSession: () => {
        authService.logout();
        set({ user: null, accessibleStores: null, store: null });
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({
        user: state.user,
        accessibleStores: state.accessibleStores,
        store: state.store,
      }),
    },
  ),
);
