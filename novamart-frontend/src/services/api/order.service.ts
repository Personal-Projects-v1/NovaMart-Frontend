import type { Coupon, Order } from "@/types";
import { apiRequest } from "./client";
import { orNull } from "./category.service";

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number; selectedVariants: Record<string, string> }[];
  address: {
    fullName: string;
    phone: string;
    email?: string;
    country: string;
    province: string;
    city: string;
    district?: string;
    street: string;
    postalCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  shippingMethod: "standard" | "express" | "pickup";
  paymentMethod: "card" | "mobile-money" | "paypal" | "bank";
  couponCode?: string;
}

/** GET /orders */
export function listOrders() {
  return apiRequest<Order[]>("/orders");
}

/** GET /orders/{id} - null when it doesn't exist (or belongs to someone else). */
export function getOrder(id: string): Promise<Order | null> {
  return orNull(apiRequest<Order>(`/orders/${encodeURIComponent(id)}`));
}

/** GET /orders/track - guest-friendly lookup by order number + checkout email/phone. */
export function trackOrder(orderNumber: string, contact: string) {
  return orNull(apiRequest<Order>("/orders/track", { anonymous: true, params: { orderNumber, contact } }));
}

export function cancelOrder(id: string) {
  return apiRequest<Order>(`/orders/${id}/cancel`, { method: "POST" });
}

export function requestReturn(
  orderId: string,
  payload: { itemIds: string[]; reason: string; details?: string; refundMethod: "original" | "store-credit" }
) {
  return apiRequest<{ returnId: string; status: string }>(`/orders/${orderId}/returns`, { method: "POST", body: payload });
}

/**
 * POST /orders. Works signed-in (the order is linked to the account) or as a guest.
 * Prices are not sent: the server prices every line from the catalog.
 */
export function placeOrder(payload: PlaceOrderPayload) {
  return apiRequest<Order>("/orders", { method: "POST", body: payload });
}

/** POST /coupons/validate - a rejected code comes back as `error`, not as an exception. */
export async function validateCoupon(code: string, subtotal: number): Promise<{ coupon: Coupon | null; error?: string }> {
  const res = await apiRequest<{ coupon: Coupon | null; error?: string | null }>("/coupons/validate", {
    method: "POST",
    anonymous: true,
    body: { code, subtotal },
  });
  return { coupon: res.coupon, error: res.error ?? undefined };
}

/** GET /coupons/active */
export function listActiveCoupons() {
  return apiRequest<Coupon[]>("/coupons/active", { anonymous: true });
}
