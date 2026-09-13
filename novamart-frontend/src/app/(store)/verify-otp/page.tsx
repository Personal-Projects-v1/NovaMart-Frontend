"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/common/button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

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

  function verify() {
    const code = digits.join("");
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    toast.success("Verified successfully!");
    router.push("/account");
  }

  return (
    <AuthShell title="Enter verification code" subtitle="We sent a 6-digit code to your email or phone.">
      <div className="flex justify-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className="h-12 w-11 rounded-xl border border-border text-center text-lg font-bold outline-none focus:border-brand"
          />
        ))}
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={verify}>Verify Code</Button>
      <p className="mt-4 text-center text-sm text-muted">
        {seconds > 0 ? (
          `Resend code in ${seconds}s`
        ) : (
          <button onClick={() => setSeconds(60)} className="font-semibold text-brand hover:underline">Resend Code</button>
        )}
      </p>
    </AuthShell>
  );
}
