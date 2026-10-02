"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { useAuthStore } from "@/store/auth.store";
import { resendVerification, verifyEmail } from "@/services/api/auth.service";
import { errorMessage } from "@/services/api/client";

export default function VerifyEmailPage() {
  // useSearchParams needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyEmail() {
  const token = useSearchParams().get("token");
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const [sending, setSending] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "done" | "failed">(token ? "verifying" : "idle");
  const attempted = useRef(false);

  // Arriving from the emailed link: confirm the token once.
  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    verifyEmail(token)
      .then(() => {
        setStatus("done");
        if (user) setUser({ ...user, emailVerified: true });
      })
      .catch((e) => {
        setStatus("failed");
        toast.error(errorMessage(e));
      });
  }, [token, user, setUser]);

  async function resend() {
    setSending(true);
    try {
      const res = await resendVerification();
      setDevToken(res?.devToken ?? null);
      toast.success("Verification email sent.");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSending(false);
    }
  }

  if (status === "verifying") {
    return (
      <AuthShell title="Verifying your email">
        <div className="flex flex-col items-center text-center">
          <Loader2 size={40} className="mb-3 animate-spin text-brand" />
          <p className="text-sm text-muted">Hold on while we confirm your address…</p>
        </div>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell title="Email verified">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 size={40} className="mb-3 text-success" />
          <p className="text-sm text-muted">Thanks! Your email address is confirmed.</p>
          <Link href={isAuthenticated ? "/account" : "/login"}><Button className="mt-5">{isAuthenticated ? "Go to my account" : "Sign in"}</Button></Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Verify your email">
      <div className="flex flex-col items-center text-center">
        {status === "failed" ? <XCircle size={40} className="mb-3 text-brand" /> : <MailCheck size={40} className="mb-3 text-brand" />}
        <p className="text-sm text-muted">
          {status === "failed" ? (
            "That verification link is invalid or has expired. Request a new one below."
          ) : (
            <>
              We&apos;ve sent a verification link to <span className="font-semibold text-foreground">{user?.email ?? "your email address"}</span>. Click the link to activate your account.
            </>
          )}
        </p>
        {isAuthenticated ? (
          <>
            <Button variant="outline" className="mt-5" onClick={resend} disabled={sending}>{sending ? "Sending..." : "Resend Verification Email"}</Button>
            {devToken && (
              <p className="mt-4 rounded-xl bg-surface p-3 text-xs text-muted">
                Dev mode (no mail server): <Link href={`/verify-email?token=${devToken}`} className="font-semibold text-brand hover:underline">open the verification link</Link>
              </p>
            )}
            <Link href="/verify-otp" className="mt-4 text-sm font-semibold text-brand hover:underline">Verify with a code instead</Link>
          </>
        ) : (
          <Link href="/login?next=/verify-email" className="mt-5 text-sm font-semibold text-brand hover:underline">Sign in to resend the email</Link>
        )}
      </div>
    </AuthShell>
  );
}
