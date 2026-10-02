/**
 * Server-component data fetching (SEO pages: category, brand, product, ...).
 * Public catalog reads only - it never sends credentials and doesn't touch the client-side auth store.
 * Responses are cached briefly by Next so popular pages don't hit the API on every request.
 */
import { API_BASE_URL } from "@/constants/site";

export async function serverGet<T>(path: string, revalidateSeconds = 60): Promise<T | null> {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL.replace(/\/?$/, "/"));
  const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed: ${res.status} ${url.pathname}`);
  const envelope = (await res.json()) as { data: T };
  return envelope.data;
}
