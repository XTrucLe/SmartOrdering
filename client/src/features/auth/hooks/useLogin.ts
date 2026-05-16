"use client";

import { useState } from "react";
import { useAuthStore } from "../auth.store";
import { LoginFormData } from "../validations/login.schema";
import { useRouter } from "next/navigation";
import { sessionService } from "../services/session";
import { authService } from "../services/auth";
import { resolveRedirect } from "../auth-flow";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const setSection = useAuthStore((state) => state.setSession);
  const setStore = useAuthStore((state) => state.setStore);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await authService.login(data);
      const session = await sessionService.initSession();

      if (session) {
        const { user, store } = session;
        setSection(user, store);
        if (store.length === 1) setStore(store[0]);

        router.replace(resolveRedirect(user, store));
      }
      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    loading,
  };
};
