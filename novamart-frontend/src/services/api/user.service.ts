import { addresses, mockUser, notifications, orders } from "@/mocks/misc";
import { stores } from "@/mocks/misc";
import type { Address, User } from "@/types";
import { mockDelay } from "./client";

/** POST /api/v1/auth/login */
export async function login(email: string, _password: string): Promise<User> {
  return mockDelay({ ...mockUser, email }, 500);
}

/** POST /api/v1/auth/register */
export async function register(payload: { firstName: string; lastName: string; email: string }): Promise<User> {
  return mockDelay({ ...mockUser, ...payload, id: `u-${Date.now()}` }, 600);
}

/** POST /api/v1/auth/forgot-password */
export async function requestPasswordReset(_email: string) {
  return mockDelay({ success: true }, 500);
}

/** POST /api/v1/auth/reset-password */
export async function resetPassword(_token: string, _password: string) {
  return mockDelay({ success: true }, 500);
}

/** GET /api/v1/users/me */
export async function getCurrentUser(): Promise<User> {
  return mockDelay(mockUser);
}

/** GET /api/v1/users/me/addresses */
export async function listAddresses(): Promise<Address[]> {
  return mockDelay(addresses);
}

export async function listNotifications() {
  return mockDelay(notifications);
}

export async function listOrders() {
  return mockDelay(orders);
}

export async function listStores() {
  return mockDelay(stores);
}
