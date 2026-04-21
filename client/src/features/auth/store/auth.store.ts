import { create } from "zustand";
import { login } from "../services/login";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    refreshToken: string | null;

    globalRole: string | null;
    user: {
        id: string;
        email: string;
        name: string;
    } | null;

    activeStore: {
        id: string;
        slug: string;
        role: string
    } | null
}

interface AuthActions {
    login: (data: { email: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    accessToken: null,
    isAuthenticated: false,
    refreshToken: null,
    globalRole: null,
    user: null,
    activeStore: null,
    login: async (data) => {
        const response = await login(data);
        set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            globalRole: response.globalRole,
            user: response.user,
            activeStore: response.activeStore
        });
    },
}));