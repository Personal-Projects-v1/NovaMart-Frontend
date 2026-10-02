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
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lift",
        className
      )}
    >
      <div className="relative overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#f3f4f6]">
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

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addToCart(product, 1)}
          className="absolute inset-x-3 bottom-3 flex h-10 translate-y-[140%] items-center justify-center gap-2 rounded-full bg-foreground/95 text-xs font-semibold text-white shadow-lg backdrop-blur transition duration-300 hover:bg-brand group-hover:translate-y-0 focus-visible:translate-y-0 disabled:hidden max-sm:translate-y-0"
        >
          <ShoppingCart size={14} /> Add to cart
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{product.brand.name}</span>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground hover:text-brand">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} size={12} />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-auto pt-1" />
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-[11px] font-medium text-warning">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}
