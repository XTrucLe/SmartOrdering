"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginFormData,
} from "../../../lib/validations/login.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    console.log(data);

    try {
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      // const result = await res.json();

      // if (!res.ok) {
      //   return;
      // }

      router.replace(`/pho-88/`);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm border shadow-sm min-w-[320px]">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Use your staff account to continue
          </p>
        </CardHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-6 pt-2 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@store.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 font-medium"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
