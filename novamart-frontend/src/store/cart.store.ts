"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (productId, quantity, selectedVariants = {}) => {
        const existing = get().items.find(
          (i) => i.productId === productId && JSON.stringify(i.selectedVariants) === JSON.stringify(selectedVariants)
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                productId,
                quantity,
                selectedVariants,
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "NovaMalt-cart" }
  )
);

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
