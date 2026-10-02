"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Store } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { logout as logoutRequest } from "@/services/api/auth.service";

/** Avatar with the signed-in admin's initial, plus links back to the storefront and to sign out. */
export function AdminUserBadge() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface sm:flex">
        <Store size={14} /> Storefront
      </Link>
      <button
        onClick={async () => {
          await logoutRequest();
          logout();
          toast.success("Signed out");
          router.push("/login");
        }}
        aria-label="Sign out"
        title="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface"
      >
        <LogOut size={16} />
      </button>
      <div title={user ? `${user.firstName} ${user.lastName}` : undefined} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
        {user?.firstName?.charAt(0).toUpperCase() ?? "A"}
      </div>
    </div>
  );
}
