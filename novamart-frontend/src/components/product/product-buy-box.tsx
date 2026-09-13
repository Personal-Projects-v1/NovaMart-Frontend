"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Scale, Share2, ShieldCheck, Truck, RefreshCcw, Copy } from "lucide-react";
import { toast } from "sonner";
import { Rating } from "@/components/common/rating";
import { PriceDisplay } from "@/components/common/price-display";
import { QuantitySelector } from "@/components/common/quantity-selector";
import { Button } from "@/components/common/button";
import { VariantSelector } from "./variant-selector";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCompareStore } from "@/store/compare.store";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import type { ProductWithRelations } from "@/types";

export function ProductBuyBox({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addToCart = useAddToCart();
  const isSaved = useWishlistStore((s) => s.isSaved(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isComparing = useCompareStore((s) => s.isComparing(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-brand">
        <Link href={`/brand/${product.brand.slug}`} className="hover:underline">{product.brand.name}</Link>
      </span>
      <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Rating value={product.rating} count={product.reviewCount} />
        <span className="text-xs text-muted">SKU: {product.sku}</span>
        <span className={outOfStock ? "text-xs font-semibold text-brand" : "text-xs font-semibold text-success"}>
          {outOfStock ? "Out of stock" : lowStock ? `Only ${product.stock} left in stock` : "In stock"}
        </span>
      </div>

      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" className="mt-4" />
      <p className="mt-1 text-xs text-muted">or 4 interest-free payments of {(product.price / 4).toFixed(2)} with installments</p>

      <p className="mt-4 text-sm text-muted">{product.shortDescription}</p>

      <div className="mt-5 flex flex-col gap-4">
        {product.variants.map((group) => (
          <VariantSelector
            key={group.id}
            group={group}
            selected={selectedVariants[group.name]}
            onSelect={(value) => setSelectedVariants((prev) => ({ ...prev, [group.name]: value }))}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
        <Button
          size="lg"
          className="flex-1"
          disabled={outOfStock}
          onClick={() => addToCart(product, quantity, selectedVariants)}
        >
          Add to Cart
        </Button>
      </div>
      <Button
        size="lg"
        variant="secondary"
        className="mt-3 w-full"
        disabled={outOfStock}
        onClick={() => {
          addToCart(product, quantity, selectedVariants, { openCartOnAdd: false });
          router.push("/checkout");
        }}
      >
        Buy Now
      </Button>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => { toggleWishlist(product.id); toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist"); }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
        >
          <Heart size={16} className={isSaved ? "fill-brand text-brand" : ""} /> Wishlist
        </button>
        <button
          onClick={() => {
            const result = toggleCompare(product.id);
            if (result.reason) toast.error(result.reason);
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
        >
          <Scale size={16} className={isComparing ? "text-brand" : ""} /> Compare
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            toast.success("Product link copied to clipboard");
          }}
          aria-label="Share product"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-brand hover:text-brand"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-surface p-4 text-sm">
        <div className="flex items-start gap-2">
          <Truck size={16} className="mt-0.5 shrink-0 text-brand" />
          <span>{product.freeShipping ? "Free" : "$9.99"} standard shipping · Estimated delivery in 5-7 business days to Kigali</span>
        </div>
        <div className="flex items-start gap-2">
          <RefreshCcw size={16} className="mt-0.5 shrink-0 text-brand" />
          <span>30-day hassle-free returns · Store pickup available at NovaMalt Kigali Heights</span>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand" />
          <span>{product.warrantyMonths}-month manufacturer warranty included</span>
        </div>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-brand"
        >
          <Copy size={12} /> Copy product URL
        </button>
      </div>
    </div>
  );
}
