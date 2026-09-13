"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useState } from "react";
import { categories } from "@/mocks/categories";
import { MegaMenu } from "./mega-menu";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hidden border-b border-border bg-white lg:block" onMouseLeave={() => setOpen(false)}>
      <div className="container-shell relative flex h-11 items-center gap-1">
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
        >
          <button className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold", open ? "bg-surface text-brand" : "text-foreground hover:bg-surface")}>
            <Icons.LayoutGrid size={16} /> All Categories
          </button>
          {open && (
            <div className="absolute left-0 top-full z-30 pt-2">
              <MegaMenu />
            </div>
          )}
        </div>
        {categories.map((cat) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-foreground"
            >
              <Icon size={14} /> {cat.name}
            </Link>
          );
        })}
        <Link href="/deals" className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">
          <Icons.Zap size={14} /> Deals
        </Link>
      </div>
    </nav>
  );
}
