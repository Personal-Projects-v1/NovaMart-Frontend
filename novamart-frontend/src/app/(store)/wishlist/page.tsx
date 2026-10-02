"use client";

import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/common/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useWishlistStore } from "@/store/wishlist.store";
import { useProductsByIds } from "@/hooks/use-catalog";
import { SkeletonGrid } from "@/components/common/states";
import type { ProductWithRelations } from "@/types";

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);

  const { byId, isLoading } = useProductsByIds(productIds);
  // keep the order of the wishlist; saved products that were removed from the catalog simply disappear
  const items = productIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);

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

      {isLoading && items.length === 0 ? (
        <SkeletonGrid count={4} />
      ) : items.length === 0 ? (
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
