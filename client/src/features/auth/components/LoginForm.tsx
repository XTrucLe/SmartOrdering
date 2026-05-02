"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginFormData } from "../validations/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

type Props = {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onSubmit: () => void;
};

export function LoginForm({
  register,
  errors,
  loading,
  showPassword,
  setShowPassword,
  onSubmit,
}: Props) {
  return (
    <Card className="w-full max-w-md border-border/50 shadow-2xl bg-card/60 backdrop-blur-md p-2 pt-8 z-10">
      <CardHeader className="space-y-3 text-center pb-2">
        <div className="mx-auto bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your staff credentials to access the dashboard
          </p>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit} className="px-6 py-4 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs uppercase tracking-widest font-bold text-accent-foreground ml-1"
          >
            Work Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-5.5 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 z-10" />
            <Input
              id="email"
              type="email"
              placeholder="staff@store.com"
              className="pl-10 bg-background/50 border-border focus-visible:ring-primary/20 h-11 rounded-xl transition-all"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <Label
              htmlFor="password"
              className="text-xs uppercase tracking-widest font-bold text-accent-foreground"
            >
              Password
            </Label>
            <a
              href="#"
              className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-5.5 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 z-10" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 bg-background/50 border-border focus-visible:ring-primary/20 h-11 rounded-xl transition-all"
              {...register("password")}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5.5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-20"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="flex flex-col items-center gap-1 pt-6 border-t border-border mt-6">
          <span className="text-xs font-semibold text-muted-foreground/60 ">
            © 2024 Store Manager
          </span>

          <a
            href="#"
            className="text-xs font-bold text-primary/80 hover:text-primary transition-colors"
          >
            Support Center
          </a>
        </div>
      </form>
    </Card>
  );
}
