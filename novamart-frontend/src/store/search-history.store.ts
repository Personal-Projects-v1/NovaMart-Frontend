"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  recent: string[];
  add: (term: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      recent: [],
      add: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const rest = get().recent.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
        set({ recent: [trimmed, ...rest].slice(0, 8) });
      },
      clear: () => set({ recent: [] }),
    }),
    { name: "NovaMalt-search-history" }
  )
);

export const TRENDING_SEARCHES = [
  "Wireless earbuds",
  "Gaming laptop",
  "Smartwatch",
  "4K drone",
  "Mechanical keyboard",
  "Power bank",
];
