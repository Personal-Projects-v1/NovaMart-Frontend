import type { User } from "@/types";
import { useAuthStore, type Session } from "@/store/auth.store";
import { apiRequest } from "./client";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    createdAt?: string;
  };
}

/** Dev-only secret echoed by the backend when no mail provider is configured. */
export interface DevToken {
  devToken?: string;
}

function toSession(res: AuthResponse): Session {
  const u = res.user;
  const user: User = {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone ?? undefined,
    avatar: u.avatarUrl ?? undefined,
    role: u.role === "ADMIN" ? "admin" : "customer",
    createdAt: u.createdAt ?? new Date().toISOString(),
    emailVerified: u.emailVerified,
    phoneVerified: u.phoneVerified,
  };
  return { user, accessToken: res.accessToken, refreshToken: res.refreshToken, sessionId: res.sessionId };
}

/** The backend only accepts +digits for phone numbers, so strip the spaces/dashes people type. */
export function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

/** POST /auth/login */
export async function login(email: string, password: string): Promise<Session> {
  return toSession(await apiRequest<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, anonymous: true }));
}

/** POST /auth/register */
export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<Session> {
  const body = { ...payload, phone: payload.phone ? normalizePhone(payload.phone) : undefined };
  return toSession(await apiRequest<AuthResponse>("/auth/register", { method: "POST", body, anonymous: true }));
}

/** POST /auth/logout - best effort; the local session is cleared regardless. */
export async function logout() {
  const { refreshToken } = useAuthStore.getState();
  if (refreshToken) {
    try {
      await apiRequest("/auth/logout", { method: "POST", body: { refreshToken }, anonymous: true });
    } catch {
      /* already invalid or offline */
    }
  }
}

/** POST /auth/logout-all */
export function logoutAll() {
  return apiRequest<void>("/auth/logout-all", { method: "POST" });
}

/** POST /auth/forgot-password (always succeeds so emails can't be enumerated) */
export function requestPasswordReset(email: string) {
  return apiRequest<DevToken | null>("/auth/forgot-password", { method: "POST", body: { email }, anonymous: true });
}

/** POST /auth/reset-password */
export function resetPassword(token: string, newPassword: string) {
  return apiRequest<void>("/auth/reset-password", { method: "POST", body: { token, newPassword }, anonymous: true });
}

/** POST /auth/verify-email */
export function verifyEmail(token: string) {
  return apiRequest<void>("/auth/verify-email", { method: "POST", body: { token }, anonymous: true });
}

/** POST /auth/resend-verification */
export function resendVerification() {
  return apiRequest<DevToken | null>("/auth/resend-verification", { method: "POST" });
}

/** POST /auth/send-otp */
export function sendOtp() {
  return apiRequest<DevToken | null>("/auth/send-otp", { method: "POST", body: { type: "EMAIL_VERIFICATION" } });
}

/** POST /auth/verify-otp */
export function verifyOtp(code: string) {
  return apiRequest<void>("/auth/verify-otp", { method: "POST", body: { code, type: "EMAIL_VERIFICATION" } });
}
