"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "./product-grid";
import type { ProductWithRelations } from "@/types";

export function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
  contained = true,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
}: {
  title: string;
  subtitle?: string;
  products: ProductWithRelations[];
  viewAllHref?: string;
  /** Set to false when the rail is already inside a page container. */
  contained?: boolean;
  columns?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className={contained ? "container-shell py-12" : "py-10"}>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            View all <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <ProductGrid products={products} columns={columns} />
    </section>
  );
}
