"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuthStore, useHydrated } from "@/store/auth.store";
import { Button } from "@/components/common/button";
import { SkeletonLine } from "@/components/common/states";

/**
 * Client-side route guard. Waits for the persisted session to load, sends signed-out visitors to the
 * login page (returning them afterwards), and blocks non-admins from admin screens.
 * This is a UX convenience only - the API enforces the same rules on every request.
 */
export function RequireAuth({ role, children }: { role?: "admin"; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="container-shell flex flex-col gap-3 py-10">
        <SkeletonLine className="h-8 w-48" />
        <SkeletonLine className="h-40 w-full" />
      </div>
    );
  }

  if (role === "admin" && user?.role !== "admin") {
    return (
      <div className="container-shell flex flex-col items-center py-20 text-center">
        <ShieldAlert size={40} className="mb-3 text-brand" />
        <h1 className="text-xl font-bold">Admin access required</h1>
        <p className="mt-1 text-sm text-muted">Your account doesn&apos;t have permission to view this page.</p>
        <Link href="/" className="mt-5"><Button>Back to store</Button></Link>
      </div>
    );
  }

  return <>{children}</>;
}
