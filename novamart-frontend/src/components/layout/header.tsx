"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Scale, ShoppingCart, User, X } from "lucide-react";
import * as Icons from "lucide-react";
import { SearchBar } from "./search-bar";
import { RegionCurrencySelector } from "./region-currency-selector";
import { CategoryNav } from "./category-nav";
import { MAIN_NAV, SITE_NAME } from "@/constants/site";
import { useCartCount, useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCompareStore } from "@/store/compare.store";
import { categories } from "@/mocks/categories";
import { cn } from "@/lib/utils";

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartCount();
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const compareCount = useCompareStore((s) => s.productIds.length);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="hidden bg-foreground text-white lg:block">
        <div className="container-shell flex h-8 items-center justify-between text-xs">
          <p className="animate-marquee whitespace-nowrap font-medium">
            Free worldwide shipping on orders over $200 &nbsp;•&nbsp; 30-day hassle-free returns &nbsp;•&nbsp; New drops every Friday
          </p>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:text-brand-soft">Track Order</Link>
            <Link href="/stores" className="hover:text-brand-soft">Store Locator</Link>
            <Link href="/support" className="hover:text-brand-soft">Support</Link>
          </div>
        </div>
      </div>

      <div className="container-shell flex h-16 items-center gap-3 sm:gap-6">
        <button className="p-1 lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Icons.Zap size={18} fill="white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">{SITE_NAME}</span>
        </Link>

        <SearchBar className="hidden max-w-xl flex-1 md:block" />

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {MAIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <div className="hidden lg:block">
            <RegionCurrencySelector />
          </div>
          <Link href="/account" aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface sm:flex">
            <User size={20} />
          </Link>
          <Link href="/compare" aria-label="Compare" className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface sm:flex">
            <Scale size={20} />
            <CountBubble count={compareCount} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface">
            <Heart size={20} />
            <CountBubble count={wishlistCount} />
          </Link>
          <button aria-label="Cart" onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface">
            <ShoppingCart size={20} />
            <CountBubble count={cartCount} />
          </button>
        </div>
      </div>

      <div className="border-t border-border p-3 md:hidden">
        <SearchBar />
      </div>

      <CategoryNav />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-display text-lg font-bold">{SITE_NAME}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Menu</p>
              <div className="mb-6 flex flex-col">
                {MAIN_NAV.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2.5 text-sm font-semibold hover:bg-surface">
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
              <div className="flex flex-col">
                {categories.map((cat) => {
                  const Icon = (Icons[cat.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
                  return (
                    <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm hover:bg-surface")}>
                      <Icon size={16} /> {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
