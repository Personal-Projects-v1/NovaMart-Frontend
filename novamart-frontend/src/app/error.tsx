"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        <AlertTriangle size={36} />
      </span>
      <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button className="mt-6" onClick={reset}>Try Again</Button>
    </div>
  );
}
