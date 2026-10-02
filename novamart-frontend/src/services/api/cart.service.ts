import type { CartItem, WishlistItem } from "@/types";
import { apiRequest } from "./client";

interface CartLine {
  productId: string;
  quantity: number;
  selectedVariants: Record<string, string>;
}

// ----- cart (all calls return the full, authoritative server cart) ----------------------------

export const getServerCart = () => apiRequest<CartItem[]>("/cart");

export const addServerCartItem = (line: CartLine) =>
  apiRequest<CartItem[]>("/cart/items", { method: "POST", body: line });

export const mergeServerCart = (items: CartLine[]) =>
  apiRequest<CartItem[]>("/cart/merge", { method: "POST", body: { items } });

export const updateServerCartItem = (id: string, quantity: number) =>
  apiRequest<CartItem[]>(`/cart/items/${id}`, { method: "PATCH", body: { quantity } });

export const removeServerCartItem = (id: string) =>
  apiRequest<CartItem[]>(`/cart/items/${id}`, { method: "DELETE" });

export const clearServerCart = () => apiRequest<void>("/cart", { method: "DELETE" });

// ----- wishlist -------------------------------------------------------------------------------

export const getServerWishlist = () => apiRequest<WishlistItem[]>("/wishlist");

export const addServerWishlistItem = (productId: string) =>
  apiRequest<WishlistItem[]>(`/wishlist/${productId}`, { method: "POST" });

export const removeServerWishlistItem = (productId: string) =>
  apiRequest<WishlistItem[]>(`/wishlist/${productId}`, { method: "DELETE" });

export const mergeServerWishlist = (productIds: string[]) =>
  apiRequest<WishlistItem[]>("/wishlist/merge", { method: "POST", body: { productIds } });
