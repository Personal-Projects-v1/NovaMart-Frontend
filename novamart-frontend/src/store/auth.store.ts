"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** Id of this browser's refresh-token row, used to mark "this device" in the sessions list. */
  sessionId: string | null;
  isAuthenticated: boolean;
  login: (session: Session) => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string, sessionId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      isAuthenticated: false,
      login: ({ user, accessToken, refreshToken, sessionId }) =>
        set({ user, accessToken, refreshToken, sessionId: sessionId ?? null, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken, sessionId) =>
        set((s) => ({ accessToken, refreshToken, sessionId: sessionId ?? s.sessionId })),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, sessionId: null, isAuthenticated: false }),
    }),
    {
      name: "NovaMart-auth",
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        sessionId: s.sessionId,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

/**
 * True once running in the browser, where the persisted session has already been read from localStorage.
 * Server render and the hydration pass see `false`, so markup that depends on the session never mismatches.
 */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
