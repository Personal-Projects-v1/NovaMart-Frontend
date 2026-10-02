"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useProductsByIds } from "@/hooks/use-catalog";
import type { CartItem, ProductWithRelations } from "@/types";

export interface CartLine {
  item: CartItem;
  product: ProductWithRelations;
}

/**
 * Cart items joined with their current catalog data (price, stock, thumbnail).
 * Items whose product no longer exists are dropped from the lines.
 */
export function useCartLines() {
  const items = useCartStore((s) => s.items);
  const ids = useMemo(() => items.map((i) => i.productId), [items]);
  const { byId, isLoading } = useProductsByIds(ids);

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((item) => ({ item, product: byId.get(item.productId) }))
        .filter((l): l is CartLine => !!l.product),
    [items, byId]
  );
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0), [lines]);

  return { items, lines, subtotal, isLoading };
}
