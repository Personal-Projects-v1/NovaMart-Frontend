import type {
  Address,
  AppNotification,
  CommunicationPreferences,
  Review,
  Store,
  User,
  UserSession,
} from "@/types";
import { apiRequest } from "./client";

/** GET /users/me */
export function getCurrentUser() {
  return apiRequest<User>("/users/me");
}

/** PATCH /users/me */
export function updateProfile(payload: {
  firstName: string;
  lastName: string;
  phone?: string;
  birthday?: string | null;
  gender?: string | null;
}) {
  return apiRequest<User>("/users/me", { method: "PATCH", body: payload });
}

/** PUT /users/me/preferences */
export function updatePreferences(preferences: CommunicationPreferences) {
  return apiRequest<User>("/users/me/preferences", { method: "PUT", body: preferences });
}

/** PUT /users/me/password */
export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<void>("/users/me/password", { method: "PUT", body: { currentPassword, newPassword } });
}

// ----- addresses -----------------------------------------------------------------------------

export type AddressInput = Omit<Address, "id"> & { id?: string };

function addressBody(a: AddressInput) {
  // the id travels in the URL, not the body
  const rest: Partial<AddressInput> = { ...a };
  delete rest.id;
  return rest;
}

/** GET /users/me/addresses */
export function listAddresses() {
  return apiRequest<Address[]>("/users/me/addresses");
}

export function createAddress(address: AddressInput) {
  return apiRequest<Address>("/users/me/addresses", { method: "POST", body: addressBody(address) });
}

export function updateAddress(id: string, address: AddressInput) {
  return apiRequest<Address>(`/users/me/addresses/${id}`, { method: "PUT", body: addressBody(address) });
}

export function deleteAddress(id: string) {
  return apiRequest<void>(`/users/me/addresses/${id}`, { method: "DELETE" });
}

export function setDefaultAddress(id: string) {
  return apiRequest<Address>(`/users/me/addresses/${id}/default`, { method: "PATCH" });
}

// ----- sessions ------------------------------------------------------------------------------

export function listSessions() {
  return apiRequest<UserSession[]>("/users/me/sessions");
}

export function revokeSession(id: string) {
  return apiRequest<void>(`/users/me/sessions/${id}`, { method: "DELETE" });
}

// ----- notifications -------------------------------------------------------------------------

export function listNotifications() {
  return apiRequest<AppNotification[]>("/notifications");
}

export function markNotificationRead(id: string, read = true) {
  return apiRequest<AppNotification>(`/notifications/${id}/${read ? "read" : "unread"}`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return apiRequest<void>("/notifications/read-all", { method: "POST" });
}

export function deleteNotification(id: string) {
  return apiRequest<void>(`/notifications/${id}`, { method: "DELETE" });
}

// ----- misc ----------------------------------------------------------------------------------

/** GET /users/me/reviews */
export function listMyReviews() {
  return apiRequest<Review[]>("/users/me/reviews");
}

export function deleteReview(id: string) {
  return apiRequest<void>(`/reviews/${id}`, { method: "DELETE" });
}

/** GET /stores */
export function listStores() {
  return apiRequest<Store[]>("/stores", { anonymous: true });
}
