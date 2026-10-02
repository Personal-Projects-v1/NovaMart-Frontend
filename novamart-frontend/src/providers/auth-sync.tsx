"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useHydrated } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { getCurrentUser } from "@/services/api/user.service";

/**
 * Keeps client state consistent with the session:
 *  - after load/sign-in: refresh the profile and adopt the server cart + wishlist (merging guest items);
 *  - on sign-out (signed in -> signed out): drop per-user data so the next visitor starts clean.
 *    A guest who was never signed in keeps their local cart.
 * Renders nothing.
 */
export function AuthSync() {
  const hydrated = useHydrated();
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      wasAuthenticated.current = true;
      getCurrentUser()
        .then((user) => useAuthStore.getState().setUser(user))
        .catch(() => undefined); // a dead session is handled by the client's refresh/sign-out logic
      void useCartStore.getState().syncWithServer();
      void useWishlistStore.getState().syncWithServer();
    } else if (wasAuthenticated.current) {
      wasAuthenticated.current = false;
      useCartStore.getState().reset();
      useWishlistStore.getState().reset();
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] === "me" });
    }
  }, [hydrated, isAuthenticated, userId, queryClient]);

  return null;
}
