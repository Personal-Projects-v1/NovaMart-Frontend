"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENCIES, REGIONS } from "@/constants/site";

interface PreferencesState {
  regionCode: (typeof REGIONS)[number]["code"];
  currencyCode: (typeof CURRENCIES)[number]["code"];
  setRegion: (code: (typeof REGIONS)[number]["code"]) => void;
  setCurrency: (code: (typeof CURRENCIES)[number]["code"]) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      regionCode: "RW",
      currencyCode: "USD",
      setRegion: (regionCode) => set({ regionCode }),
      setCurrency: (currencyCode) => set({ currencyCode }),
    }),
    { name: "voltrix-preferences" }
  )
);
