"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/hooks/use-catalog";
import { listProducts } from "@/services/api/product.service";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const { categories } = useCategories();
  const [active, setActive] = useState<string | null>(null);
  const activeCategory = categories.find((c) => c.slug === active) ?? categories[0];
  const { data: featuredPage } = useQuery({
    queryKey: ["mega-menu-products", activeCategory?.slug],
    queryFn: () => listProducts({ categorySlugs: [activeCategory!.slug], pageSize: 3 }),
    enabled: !!activeCategory,
    staleTime: 5 * 60 * 1000,
  });
  const featured = featuredPage?.items ?? [];

  if (!activeCategory) return null;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-0 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
      <div className="border-r border-border bg-surface/60 p-2">
        {categories.map((cat) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
          return (
            <button
              key={cat.slug}
              onMouseEnter={() => setActive(cat.slug)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                activeCategory.slug === cat.slug ? "bg-white text-brand shadow-sm" : "text-foreground hover:bg-white/70"
              )}
            >
              <Icon size={16} /> {cat.name}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-[1fr_1.1fr] gap-6 p-6">
        <div>
          <Link href={`/category/${activeCategory.slug}`} className="text-sm font-bold text-foreground hover:text-brand">
            Shop all {activeCategory.name} →
          </Link>
          <p className="mt-1.5 max-w-xs text-sm text-muted">{activeCategory.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Best sellers", "New arrivals", "On sale", "Top rated"].map((label) => (
              <Link
                key={label}
                href={`/category/${activeCategory.slug}?sort=${label === "Best sellers" ? "bestselling" : label === "New arrivals" ? "newest" : label === "On sale" ? "sale" : "rating"}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {featured.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                <Image src={p.thumbnail} alt={p.name} fill sizes="120px" className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-1.5 line-clamp-1 text-xs font-medium text-foreground group-hover:text-brand">{p.name}</p>
              <p className="text-xs font-semibold text-brand">${p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
