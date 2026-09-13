"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Package, MapPin, Heart, Star, Bell, Shield, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/reviews", label: "Reviews", icon: Star },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/preferences", label: "Preferences", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="flex flex-col gap-1 rounded-2xl border border-border bg-white p-3">
      {NAV.map((item) => {
        const active = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-brand-soft text-brand" : "text-foreground hover:bg-surface")}
          >
            <item.icon size={16} /> {item.label}
          </Link>
        );
      })}
      <button
        onClick={() => { logout(); toast.success("Signed out"); router.push("/login"); }}
        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-brand hover:bg-brand-soft"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </nav>
  );
}
