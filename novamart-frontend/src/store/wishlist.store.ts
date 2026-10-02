"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import {
  addServerWishlistItem,
  getServerWishlist,
  mergeServerWishlist,
  removeServerWishlistItem,
} from "@/services/api/cart.service";
import { errorMessage } from "@/services/api/client";

/** Guests keep a local wishlist; signed-in customers' wishlists are stored on the server. */
interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  isSaved: (productId: string) => boolean;
  remove: (productId: string) => void;
  syncWithServer: () => Promise<void>;
  reset: () => void;
}

const signedIn = () => useAuthStore.getState().isAuthenticated;

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => {
      async function remote(call: () => Promise<{ productId: string }[]>) {
        try {
          set({ productIds: (await call()).map((i) => i.productId) });
        } catch (e) {
          toast.error(errorMessage(e));
          try {
            set({ productIds: (await getServerWishlist()).map((i) => i.productId) });
          } catch {
            /* offline */
          }
        }
      }

      return {
        productIds: [],
        isSaved: (productId) => get().productIds.includes(productId),
        toggle: (productId) => {
          const exists = get().productIds.includes(productId);
          set({ productIds: exists ? get().productIds.filter((id) => id !== productId) : [...get().productIds, productId] });
          if (signedIn()) void remote(() => (exists ? removeServerWishlistItem(productId) : addServerWishlistItem(productId)));
        },
        remove: (productId) => {
          set({ productIds: get().productIds.filter((id) => id !== productId) });
          if (signedIn()) void remote(() => removeServerWishlistItem(productId));
        },
        syncWithServer: async () => {
          if (!signedIn()) return;
          try {
            const local = get().productIds;
            const items = local.length > 0 ? await mergeServerWishlist(local) : await getServerWishlist();
            set({ productIds: items.map((i) => i.productId) });
          } catch {
            /* keep local */
          }
        },
        reset: () => set({ productIds: [] }),
      };
    },
    { name: "NovaMart-wishlist", partialize: (s) => ({ productIds: s.productIds }) }
  )
);
