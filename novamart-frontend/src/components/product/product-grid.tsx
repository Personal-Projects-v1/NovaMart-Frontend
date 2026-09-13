"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import { QuickViewModal } from "./quick-view-modal";
import { EmptyState } from "@/components/common/states";
import type { ProductWithRelations } from "@/types";
import { cn } from "@/lib/utils";
import { PackageSearch } from "lucide-react";

export function ProductGrid({
  products,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  emptyMessage = "No products found",
  className,
}: {
  products: ProductWithRelations[];
  columns?: string;
  emptyMessage?: string;
  className?: string;
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithRelations | null>(null);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyMessage}
        description="Try adjusting your filters or search terms to find what you're looking for."
      />
    );
  }

  return (
    <>
      <div className={cn("grid gap-4", columns, className)}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)} />
    </>
  );
}
