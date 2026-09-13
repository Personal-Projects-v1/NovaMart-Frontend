"use client";

import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types";

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  return function addToCart(product: Pick<Product, "id" | "name" | "stock">, quantity = 1, selectedVariants: Record<string, string> = {}, options: { openCartOnAdd?: boolean } = {}) {
    if (product.stock <= 0) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }
    addItem(product.id, quantity, selectedVariants);
    toast.success(`Added ${product.name} to cart`);
    if (options.openCartOnAdd !== false) openCart();
  };
}
