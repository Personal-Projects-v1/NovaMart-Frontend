"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  Percent,
  Ticket,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/constants/site";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/promotions", label: "Promotions", icon: Percent },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"><Zap size={16} fill="white" /></span>
        <span className="font-display font-bold">{SITE_NAME} Admin</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-brand-soft text-brand" : "text-foreground hover:bg-surface")}>
              <item.icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
