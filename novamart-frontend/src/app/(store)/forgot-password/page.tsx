"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/schemas/auth.schema";
import { requestPasswordReset } from "@/services/api/user.service";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    await requestPasswordReset(values.email);
    setEmail(values.email);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Check your email">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 size={40} className="mb-3 text-success" />
          <p className="text-sm text-muted">We&apos;ve sent password reset instructions to <span className="font-semibold text-foreground">{email}</span>.</p>
          <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>Resend Email</Button>
          <Link href="/login" className="mt-4 text-sm font-semibold text-brand hover:underline">Back to Sign In</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we'll send you reset instructions.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Email</span>
          <input type="email" {...register("email")} className="input" placeholder="you@example.com" />
          {errors.email && <span className="text-xs text-brand">{errors.email.message}</span>}
        </label>
        <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Reset Link"}</Button>
      </form>
      <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-brand hover:underline">Back to Sign In</Link>
    </AuthShell>
  );
}
