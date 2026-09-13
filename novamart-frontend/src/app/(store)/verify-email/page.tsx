"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmailPage() {
  const user = useAuthStore((s) => s.user);
  const [sending, setSending] = useState(false);

  async function resend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success("Verification email resent.");
  }

  return (
    <AuthShell title="Verify your email">
      <div className="flex flex-col items-center text-center">
        <MailCheck size={40} className="mb-3 text-brand" />
        <p className="text-sm text-muted">
          We&apos;ve sent a verification link to <span className="font-semibold text-foreground">{user?.email ?? "your email address"}</span>. Click the link to activate your account.
        </p>
        <Button variant="outline" className="mt-5" onClick={resend} disabled={sending}>{sending ? "Sending..." : "Resend Verification Email"}</Button>
        <Link href="/verify-otp" className="mt-4 text-sm font-semibold text-brand hover:underline">Verify with a code instead</Link>
      </div>
    </AuthShell>
  );
}
