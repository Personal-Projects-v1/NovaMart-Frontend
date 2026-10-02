"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";
import { useAuthStore, useHydrated } from "@/store/auth.store";
import { sendOtp, verifyOtp } from "@/services/api/auth.service";
import { errorMessage } from "@/services/api/client";

export default function VerifyOtpPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const requested = useRef(false);

  async function requestCode() {
    try {
      const res = await sendOtp();
      setDevCode(res?.devToken ?? null);
      setSeconds(60);
      toast.success("We sent you a new code.");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  // Send the first code as soon as we know who the user is.
  useEffect(() => {
    if (!hydrated || !isAuthenticated || requested.current) return;
    requested.current = true;
    void requestCode();
  }, [hydrated, isAuthenticated]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setDigits(pasted.split(""));
      refs.current[5]?.focus();
    }
  }

  async function verify() {
    const code = digits.join("");
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setVerifying(true);
    try {
      await verifyOtp(code);
      if (user) setUser({ ...user, emailVerified: true });
      toast.success("Verified successfully!");
      router.push("/account");
    } catch (e) {
      toast.error(errorMessage(e));
      setDigits(Array(6).fill(""));
      refs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  if (hydrated && !isAuthenticated) {
    return (
      <AuthShell title="Enter verification code">
        <p className="text-center text-sm text-muted">
          Please <Link href="/login?next=/verify-otp" className="font-semibold text-brand hover:underline">sign in</Link> to verify your account with a code.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Enter verification code" subtitle={`We sent a 6-digit code to ${user?.email ?? "your email"}.`}>
      <div className="flex justify-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            maxLength={1}
            inputMode="numeric"
            aria-label={`Digit ${i + 1}`}
            className="h-12 w-11 rounded-xl border border-border text-center text-lg font-bold outline-none focus:border-brand"
          />
        ))}
      </div>
      {devCode && (
        <p className="mt-3 text-center text-xs text-muted">Dev mode (no mail server): your code is <span className="font-mono font-semibold text-foreground">{devCode}</span></p>
      )}
      <Button size="lg" className="mt-6 w-full" onClick={verify} disabled={verifying}>{verifying ? "Verifying..." : "Verify Code"}</Button>
      <p className="mt-4 text-center text-sm text-muted">
        {seconds > 0 ? (
          `Resend code in ${seconds}s`
        ) : (
          <button onClick={requestCode} className="font-semibold text-brand hover:underline">Resend Code</button>
        )}
      </p>
    </AuthShell>
  );
}
