"use client";

import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { products } from "@/mocks/products";
import { brands } from "@/mocks/brands";
import { categories } from "@/mocks/categories";
import { ProductGrid } from "@/components/product/product-grid";
import type { ProductWithRelations } from "@/types";

export function RecentlyViewedSection() {
  const productIds = useRecentlyViewedStore((s) => s.productIds);
  if (productIds.length === 0) return null;

  const items: ProductWithRelations[] = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      ...p,
      brand: brands.find((b) => b.id === p.brandId)!,
      category: categories.find((c) => c.id === p.categoryId)!,
    }));

  return (
    <section className="container-shell py-10">
      <h2 className="mb-5 text-xl font-bold tracking-tight sm:text-2xl">Recently Viewed</h2>
      <ProductGrid products={items} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
    </section>
  );
}
