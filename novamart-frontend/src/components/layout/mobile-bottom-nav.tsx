"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist.store";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/search", label: "Search", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-white/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium">
            <item.icon size={20} className={cn(active ? "text-brand" : "text-muted")} />
            <span className={cn(active ? "text-brand" : "text-muted")}>{item.label}</span>
            {item.href === "/wishlist" && wishlistCount > 0 && (
              <span className="absolute right-[28%] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
