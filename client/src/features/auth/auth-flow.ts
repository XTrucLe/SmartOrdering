import { Store } from "../stores/types";
import { User } from "./type/user";

export const resolveRedirect = (user: User, store: Store[]) => {
  if (user.globalRole === "admin") return `/admin/dashboard`;

  if (!store || store.length !== 1) return "/select-store";

  const currentStore = store[0];

  if (currentStore) {
    switch (currentStore.role) {
      case "owner":
        return `/owner/dashboard`;
      case "manager":
        return `/manager/dashboard`;
      case "staff":
        return `${currentStore.role}/orders`;
      default:
        return "/";
    }
  }

  return "/";
};
