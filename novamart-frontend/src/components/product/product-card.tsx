"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { ProductBadgePill } from "@/components/common/badge";
import { PriceDisplay } from "@/components/common/price-display";
import { Rating } from "@/components/common/rating";
import { WishlistButton } from "./wishlist-button";
import { CompareButton } from "./compare-button";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import type { ProductWithRelations } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  onQuickView,
  className,
}: {
  product: ProductWithRelations;
  onQuickView?: (product: ProductWithRelations) => void;
  className?: string;
}) {
  const addToCart = useAddToCart();
  const outOfStock = product.stock <= 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 20vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-0"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, 45vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badges.slice(0, 2).map((b) => (
            <ProductBadgePill key={b} badge={b} />
          ))}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <WishlistButton productId={product.id} productName={product.name} />
          <CompareButton productId={product.id} />
          {onQuickView && (
            <button
              type="button"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              <Eye size={18} />
            </button>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white">Out of stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{product.brand.name}</span>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-brand">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} size={12} />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-0.5" />

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addToCart(product, 1)}
          className="mt-2 flex h-9 items-center justify-center gap-2 rounded-full bg-foreground text-xs font-semibold text-white transition hover:bg-brand disabled:pointer-events-none disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
