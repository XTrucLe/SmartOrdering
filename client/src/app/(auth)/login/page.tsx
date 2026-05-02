"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/validations/login.schema";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { onSubmit, loading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-background overflow-hidden no-select">
      <div className="absolute w-[150vw] h-[150vh] bg-primary/5 transform translate-x-1/4 translate-y-1/4 -rotate-12 rounded-[100px]" />
      <div className="absolute w-[150vw] h-[150vh] bg-primary/5 transform -translate-x-1/4 translate-y-1/3 rotate-12 rounded-[100px]" />

      <LoginForm
        register={register}
        errors={errors}
        loading={loading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
