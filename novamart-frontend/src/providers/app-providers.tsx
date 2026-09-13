"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "0.9rem",
            fontSize: "0.875rem",
          },
        }}
      />
    </QueryProvider>
  );
}
