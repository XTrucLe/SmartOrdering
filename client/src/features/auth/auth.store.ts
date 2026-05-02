import { create } from "zustand";
import { User } from "./type/user";
import { authService } from "./services/auth";
import { Store } from "../stores/types";

interface AuthState {
  user: User | null;
  store: Store | null;

  setSession: (user: User, store: Store) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  store: null,

  setSession: (user, store) => set({ user, store }),
  clearSession: () => {
    authService.logout();
    set({ user: null, store: null });
  },
}));
