"use client";

import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { useProductsByIds } from "@/hooks/use-catalog";
import { ProductGrid } from "@/components/product/product-grid";

export function RecentlyViewedSection() {
  const productIds = useRecentlyViewedStore((s) => s.productIds);
  const { byId } = useProductsByIds(productIds);
  // keep the "most recent first" order the store maintains; skip products that no longer exist
  const items = productIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
  if (items.length === 0) return null;

  return (
    <section className="container-shell py-10">
      <h2 className="mb-5 text-xl font-bold tracking-tight sm:text-2xl">Recently Viewed</h2>
      <ProductGrid products={items} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
    </section>
  );
}
