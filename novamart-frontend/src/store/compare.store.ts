"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  productIds: string[];
  toggle: (productId: string) => { added: boolean; reason?: string };
  remove: (productId: string) => void;
  clear: () => void;
  isComparing: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isComparing: (productId) => get().productIds.includes(productId),
      remove: (productId) => set({ productIds: get().productIds.filter((id) => id !== productId) }),
      clear: () => set({ productIds: [] }),
      toggle: (productId) => {
        const exists = get().productIds.includes(productId);
        if (exists) {
          set({ productIds: get().productIds.filter((id) => id !== productId) });
          return { added: false };
        }
        if (get().productIds.length >= MAX_COMPARE) {
          return { added: false, reason: `You can compare up to ${MAX_COMPARE} products at a time.` };
        }
        set({ productIds: [...get().productIds, productId] });
        return { added: true };
      },
    }),
    { name: "voltrix-compare" }
  )
);
