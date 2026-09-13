"use client";

import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/common/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useWishlistStore } from "@/store/wishlist.store";
import { products } from "@/mocks/products";
import { brands } from "@/mocks/brands";
import { categories } from "@/mocks/categories";
import type { ProductWithRelations } from "@/types";

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);

  const items: ProductWithRelations[] = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ ...p, brand: brands.find((b) => b.id === p.brandId)!, category: categories.find((c) => c.id === p.categoryId)! }));

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <div className="mb-6 mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Wishlist ({items.length})</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Wishlist link copied"); }}
          >
            <Share2 size={14} /> Share Wishlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love and find them here later."
          action={<Link href="/shop"><Button>Discover Products</Button></Link>}
        />
      ) : (
        <ProductGrid products={items} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
      )}
    </div>
  );
}
