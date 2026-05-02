import { getMyStore } from "@/features/stores";
import { authService } from "./auth";

export const sessionService = {
  initSession: async () => {
    const [user, store] = await Promise.all([
      authService.getMyInfo(),
      getMyStore(),
    ]);

    return { user, store };
  },
};
