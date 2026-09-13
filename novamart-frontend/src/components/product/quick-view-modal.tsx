"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/common/modal";
import { PriceDisplay } from "@/components/common/price-display";
import { Rating } from "@/components/common/rating";
import { QuantitySelector } from "@/components/common/quantity-selector";
import { Button } from "@/components/common/button";
import { VariantSelector } from "./variant-selector";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import type { ProductWithRelations } from "@/types";

export function QuickViewModal({
  product,
  onOpenChange,
}: {
  product: ProductWithRelations | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addToCart = useAddToCart();

  if (!product) return null;

  return (
    <Modal open={!!product} onOpenChange={onOpenChange} title={product.name}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
          <Image src={product.images[0]} alt={product.name} fill sizes="400px" className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{product.brand.name}</span>
          <h2 className="mt-1 text-xl font-bold">{product.name}</h2>
          <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" className="mt-3" />
          <p className="mt-3 text-sm text-muted">{product.shortDescription}</p>

          <div className="mt-4 flex flex-col gap-4">
            {product.variants.map((group) => (
              <VariantSelector
                key={group.id}
                group={group}
                selected={selectedVariants[group.name]}
                onSelect={(value) => setSelectedVariants((prev) => ({ ...prev, [group.name]: value }))}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
            <Button
              className="flex-1"
              disabled={product.stock <= 0}
              onClick={() => {
                addToCart(product, quantity, selectedVariants);
                onOpenChange(false);
              }}
            >
              Add to Cart
            </Button>
          </div>
          <Link href={`/product/${product.slug}`} className="mt-4 text-sm font-semibold text-brand hover:underline">
            View full details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
