import { coupons, orderById, orders } from "@/mocks/misc";
import { generateOrderNumber } from "@/lib/utils";
import type { Address, CartItem, Coupon, Order } from "@/types";
import { mockDelay } from "./client";

/** GET /api/v1/orders */
export async function listOrders() {
  return mockDelay(orders);
}

/** GET /api/v1/orders/{id} */
export async function getOrder(id: string): Promise<Order | null> {
  return mockDelay(orderById(id) ?? null);
}

export async function cancelOrder(_id: string) {
  return mockDelay({ success: true }, 400);
}

export async function requestReturn(_orderId: string, _payload: unknown) {
  return mockDelay({ success: true, returnId: `RET-${Math.floor(Math.random() * 90000 + 10000)}` }, 500);
}

/** POST /api/v1/orders */
export async function placeOrder(payload: {
  items: CartItem[];
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}): Promise<Order> {
  return mockDelay(
    {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: "processing",
      items: payload.items.map((item, i) => ({
        id: `oi-new-${i}`,
        productId: item.productId,
        name: "",
        image: "",
        price: 0,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
      })),
      subtotal: payload.subtotal,
      discount: payload.discount,
      shipping: payload.shipping,
      tax: payload.tax,
      total: payload.total,
      shippingAddress: payload.address,
      paymentMethod: payload.paymentMethod,
      shippingMethod: payload.shippingMethod,
      timeline: [
        { status: "placed", label: "Order placed", timestamp: new Date().toISOString(), done: true },
        { status: "payment-confirmed", label: "Payment confirmed", timestamp: new Date().toISOString(), done: true },
        { status: "processing", label: "Processing", timestamp: new Date().toISOString(), done: true },
        { status: "packed", label: "Packed", timestamp: "", done: false },
        { status: "shipped", label: "Shipped", timestamp: "", done: false },
        { status: "out-for-delivery", label: "Out for delivery", timestamp: "", done: false },
        { status: "delivered", label: "Delivered", timestamp: "", done: false },
      ],
    },
    800
  );
}

/** Validate a coupon code against the mock coupon list. */
export async function validateCoupon(code: string, subtotal: number): Promise<{ coupon: Coupon | null; error?: string }> {
  const coupon = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  if (!coupon) return mockDelay({ coupon: null, error: "This coupon code doesn't exist." }, 400);
  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return mockDelay({ coupon: null, error: "This coupon has expired." }, 400);
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return mockDelay({ coupon: null, error: `Minimum order of $${coupon.minSubtotal} required for this coupon.` }, 400);
  }
  return mockDelay({ coupon }, 400);
}
