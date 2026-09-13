import type { SortOption } from "@/types";

export const SORT_OPTIONS: SortOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "bestselling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export const PRICE_RANGE = { min: 0, max: 2500 };

export const RATING_FILTERS = [4, 3, 2, 1];
