/**
 * Central API client for the Spring Boot backend.
 *
 * - Every backend response is wrapped as `{ success, message, data }`; `apiRequest` unwraps `data`.
 * - Sends the access token when one exists and transparently refreshes it once on a 401
 *   (concurrent requests share a single refresh call). If the refresh fails, the user is signed out.
 * - Failures surface as `ApiError` carrying the HTTP status, the backend message and any
 *   per-field validation messages.
 */
import { API_BASE_URL } from "@/constants/site";
import { useAuthStore } from "@/store/auth.store";

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status = 500, code?: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.name = "ApiError";
  }
}

type Params = Record<string, string | number | boolean | undefined | null | (string | number)[]>;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Params;
  /** Skip the Authorization header (login, register, public reads that must not trigger a refresh). */
  anonymous?: boolean;
  signal?: AbortSignal;
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

function buildUrl(path: string, params?: Params) {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL.replace(/\/?$/, "/"));
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function parseError(res: Response): Promise<ApiError> {
  let body: { message?: string; error?: string; fieldErrors?: Record<string, string> } = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON error body */
  }
  const firstField = body.fieldErrors ? Object.values(body.fieldErrors)[0] : undefined;
  return new ApiError(
    firstField ?? body.message ?? `Request failed (${res.status})`,
    res.status,
    body.error,
    body.fieldErrors
  );
}

let refreshInFlight: Promise<string | null> | null = null;

/** Exchanges the refresh token for a new pair. Resolves to the new access token, or null if signed out. */
function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return Promise.resolve(null);

  refreshInFlight = (async () => {
    try {
      const res = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw await parseError(res);
      const envelope = (await res.json()) as Envelope<{ accessToken: string; refreshToken: string; sessionId?: string }>;
      useAuthStore.getState().setTokens(envelope.data.accessToken, envelope.data.refreshToken, envelope.data.sessionId);
      return envelope.data.accessToken;
    } catch {
      useAuthStore.getState().logout();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

const isServer = typeof window === "undefined";

async function send(path: string, options: RequestOptions, token: string | null) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const method = options.method ?? "GET";
  return fetch(buildUrl(path, options.params), {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    // Server-rendered pages read public catalog data: cache it briefly instead of hitting the API per view.
    ...(isServer && method === "GET" && options.anonymous ? { next: { revalidate: 30 } } : {}),
  });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // The session lives in the browser, so server-side calls are always anonymous.
  let token = options.anonymous || isServer ? null : useAuthStore.getState().accessToken;
  let res: Response;
  try {
    res = await send(path, options, token);
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0, "NETWORK_ERROR");
  }

  if (res.status === 401 && !options.anonymous && !isServer && useAuthStore.getState().refreshToken) {
    token = await refreshAccessToken();
    if (token) res = await send(path, options, token);
  }

  if (!res.ok) throw await parseError(res);
  const envelope = (await res.json()) as Envelope<T>;
  return envelope.data;
}

/** Message suitable for a toast, whatever was thrown. */
export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  return error instanceof ApiError || error instanceof Error ? error.message || fallback : fallback;
}
