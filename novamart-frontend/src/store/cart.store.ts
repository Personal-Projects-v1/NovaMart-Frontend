"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { CartItem } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import {
  addServerCartItem,
  clearServerCart,
  getServerCart,
  mergeServerCart,
  removeServerCartItem,
  updateServerCartItem,
} from "@/services/api/cart.service";
import { errorMessage } from "@/services/api/client";

/**
 * Cart that works for guests and customers.
 *  - Guests: items live only in localStorage.
 *  - Signed in: the server cart is the source of truth. Every mutation is sent to the API and the
 *    store is replaced with the cart the server returns (so stock limits and merging are authoritative).
 *    Optimistic local updates keep the UI snappy; on failure the cart is reloaded from the server.
 */
interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  /** Folds the guest cart into the account cart after sign-in, then adopts the server cart. */
  syncWithServer: () => Promise<void>;
  /** Empties local state only (used on sign-out, so the next visitor starts clean). */
  reset: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const signedIn = () => useAuthStore.getState().isAuthenticated;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      /** Runs a server mutation and adopts its result; on failure shows the reason and resyncs. */
      async function remote(call: () => Promise<CartItem[]>) {
        try {
          set({ items: await call() });
        } catch (e) {
          toast.error(errorMessage(e));
          try {
            set({ items: await getServerCart() });
          } catch {
            /* offline: keep the optimistic state */
          }
        }
      }

      return {
        items: [],
        isOpen: false,
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),

        addItem: (productId, quantity, selectedVariants = {}) => {
          const existing = get().items.find(
            (i) => i.productId === productId && JSON.stringify(i.selectedVariants) === JSON.stringify(selectedVariants)
          );
          // optimistic local update (also the whole story for guests)
          if (existing) {
            set({ items: get().items.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i)) });
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
          if (signedIn()) void remote(() => addServerCartItem({ productId, quantity, selectedVariants }));
        },

        removeItem: (id) => {
          set({ items: get().items.filter((i) => i.id !== id) });
          if (signedIn()) void remote(() => removeServerCartItem(id));
        },

        updateQuantity: (id, quantity) => {
          const q = Math.max(1, quantity);
          set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity: q } : i)) });
          if (signedIn()) void remote(() => updateServerCartItem(id, q));
        },

        clear: () => {
          set({ items: [] });
          if (signedIn()) void clearServerCart().catch(() => undefined);
        },

        syncWithServer: async () => {
          if (!signedIn()) return;
          try {
            // The server merge is additive, so only fold in items created while signed out (local "ci-" ids).
            // Items already backed by the server have UUID ids; re-sending them on every page load would
            // keep adding their quantities again.
            const guestLines = get()
              .items.filter((i) => i.id.startsWith("ci-"))
              .map(({ productId, quantity, selectedVariants }) => ({ productId, quantity, selectedVariants }));
            set({ items: guestLines.length > 0 ? await mergeServerCart(guestLines) : await getServerCart() });
          } catch {
            /* keep whatever is local; the next load retries */
          }
        },

        reset: () => set({ items: [] }),
      };
    },
    { name: "NovaMart-cart", partialize: (s) => ({ items: s.items }) }
  )
);

export const useCartCount = () => useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
