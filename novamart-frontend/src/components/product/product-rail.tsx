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
}: {
  title: string;
  subtitle?: string;
  products: ProductWithRelations[];
  viewAllHref?: string;
}) {
  return (
    <section className="container-shell py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            View all <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <ProductGrid products={products} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" />
    </section>
  );
}
