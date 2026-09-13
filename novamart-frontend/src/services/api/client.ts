/**
 * Central API client.
 *
 * Today: talks to nothing — every service falls back to the mock adapter.
 * Tomorrow: point NEXT_PUBLIC_API_BASE_URL at the Spring Boot backend and
 * flip USE_MOCKS to false; the service functions below already shape their
 * inputs/outputs to match the documented Spring Boot contract, so screens
 * never need to change, only the adapter each service calls into.
 */
import { API_BASE_URL } from "@/constants/site";

export const USE_MOCKS = true;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL + "/");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Thin fetch wrapper for the future Spring Boot REST API.
 * Not used while USE_MOCKS is true, but kept ready so services can switch
 * over one function at a time.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const res = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

/** Simulates network latency for a more realistic mock experience. */
export function mockDelay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
