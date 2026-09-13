"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils";
import { registerSchema, passwordStrength, type RegisterValues } from "@/schemas/auth.schema";
import { register as registerUser } from "@/services/api/user.service";
import { useAuthStore } from "@/store/auth.store";

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-success"];

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const password = watch("password") ?? "";
  const strength = passwordStrength(password);

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    try {
      const user = await registerUser(values);
      setUser(user);
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join Voltrix for faster checkout and order tracking.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">First Name</span>
            <input {...register("firstName")} className="input" />
            {errors.firstName && <span className="text-xs text-brand">{errors.firstName.message}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Last Name</span>
            <input {...register("lastName")} className="input" />
            {errors.lastName && <span className="text-xs text-brand">{errors.lastName.message}</span>}
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Email</span>
          <input type="email" {...register("email")} className="input" />
          {errors.email && <span className="text-xs text-brand">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Phone</span>
          <input {...register("phone")} className="input" />
          {errors.phone && <span className="text-xs text-brand">{errors.phone.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Password</span>
          <input type="password" {...register("password")} className="input" />
          {password && (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-1.5 flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-full flex-1 rounded-full bg-surface-strong", i < strength && STRENGTH_COLORS[strength - 1])} />
                ))}
              </div>
              <span className="text-xs text-muted">{STRENGTH_LABELS[strength]}</span>
            </div>
          )}
          {errors.password && <span className="text-xs text-brand">{errors.password.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Confirm Password</span>
          <input type="password" {...register("confirmPassword")} className="input" />
          {errors.confirmPassword && <span className="text-xs text-brand">{errors.confirmPassword.message}</span>}
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" {...register("terms")} className="mt-0.5 accent-brand" />
          <span>I agree to the <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link></span>
        </label>
        {errors.terms && <span className="text-xs text-brand">{errors.terms.message}</span>}
        <Button type="submit" size="lg" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
