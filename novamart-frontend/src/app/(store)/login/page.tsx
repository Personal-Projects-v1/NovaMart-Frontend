"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { loginSchema, type LoginValues } from "@/schemas/auth.schema";
import { login } from "@/services/api/user.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      setUser(user);
      toast.success(`Welcome back, ${user.firstName}!`);
      router.push("/account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your NovaMart account to continue.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Email</span>
          <input type="email" {...register("email")} className="input" placeholder="you@example.com" />
          {errors.email && <span className="text-xs text-brand">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Password</span>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} {...register("password")} className="input pr-10" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-brand">{errors.password.message}</span>}
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("remember")} className="accent-brand" /> Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-brand hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={() => toast.info("Google sign-in is not available in this demo.")}>Continue with Google</Button>
        <Button variant="outline" onClick={() => toast.info("Apple sign-in is not available in this demo.")}>Continue with Apple</Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account? <Link href="/register" className="font-semibold text-brand hover:underline">Sign up</Link>
      </p>
    </AuthShell>
  );
}
