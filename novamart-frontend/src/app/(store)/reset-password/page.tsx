"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { resetPasswordSchema, passwordStrength, type ResetPasswordValues } from "@/schemas/auth.schema";
import { resetPassword } from "@/services/api/auth.service";
import { errorMessage } from "@/services/api/client";
import { cn } from "@/lib/utils";

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];

export default function ResetPasswordPage() {
  // useSearchParams needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });
  const password = watch("password") ?? "";
  const strength = passwordStrength(password);

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error("This reset link is missing its token. Request a new one.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      toast.success("Password reset successfully. Please sign in.");
      router.push("/login");
    } catch (e) {
      toast.error(errorMessage(e, "This reset link is invalid or has expired."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="Choose a new, strong password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">New Password</span>
          <input type="password" {...register("password")} className="input" />
          {password && <span className={cn("text-xs", strength >= 3 ? "text-success" : "text-warning")}>{STRENGTH_LABELS[strength]}</span>}
          {errors.password && <span className="text-xs text-brand">{errors.password.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Confirm New Password</span>
          <input type="password" {...register("confirmPassword")} className="input" />
          {errors.confirmPassword && <span className="text-xs text-brand">{errors.confirmPassword.message}</span>}
        </label>
        <Button type="submit" size="lg" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
      </form>
    </AuthShell>
  );
}
