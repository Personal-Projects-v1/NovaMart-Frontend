"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  productIds: string[];
  add: (productId: string) => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      add: (productId) => {
        const rest = get().productIds.filter((id) => id !== productId);
        set({ productIds: [productId, ...rest].slice(0, MAX_ITEMS) });
      },
    }),
    { name: "voltrix-recently-viewed" }
  )
);
