"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { QuantitySelector } from "@/components/common/quantity-selector";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/states";
import { useCartStore } from "@/store/cart.store";
import { productById } from "@/mocks/products";
import { validateCoupon } from "@/services/api/order.service";
import { formatPrice } from "@/lib/utils";
import type { Coupon } from "@/types";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const lines = items
    .map((item) => ({ item, product: productById(item.productId) }))
    .filter((l): l is { item: typeof items[number]; product: NonNullable<ReturnType<typeof productById>> } => !!l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(subtotal * (appliedCoupon.value / 100) * 100) / 100
      : appliedCoupon.value
    : 0;
  const shipping = subtotal === 0 ? 0 : shippingMethod === "express" ? 19.99 : subtotal > 200 ? 0 : 9.99;
  const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const result = await validateCoupon(couponCode, subtotal);
    setCouponLoading(false);
    if (result.coupon) {
      setAppliedCoupon(result.coupon);
      toast.success(`Coupon "${result.coupon.code}" applied!`);
    } else {
      toast.error(result.error ?? "Invalid coupon code");
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          action={<Link href="/shop"><Button>Continue Shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Shopping Cart ({lines.length})</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {lines.map(({ item, product }) => {
            const overStock = item.quantity > product.stock;
            return (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4">
                <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image src={product.thumbnail} alt={product.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${product.slug}`} className="font-semibold hover:text-brand">{product.name}</Link>
                      {Object.keys(item.selectedVariants).length > 0 && (
                        <p className="mt-0.5 text-xs text-muted">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-muted hover:text-brand">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {product.stock === 0 && <p className="mt-1 text-xs font-semibold text-brand">This item is now out of stock and won&apos;t be included at checkout.</p>}
                  {overStock && product.stock > 0 && <p className="mt-1 text-xs font-semibold text-warning">Only {product.stock} left — please reduce quantity.</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <QuantitySelector value={item.quantity} max={product.stock || 1} onChange={(q) => updateQuantity(item.id, q)} />
                    <span className="text-base font-bold">{formatPrice(product.price * item.quantity)}</span>
                  </div>
                  <button onClick={() => { removeItem(item.id); toast.success("Moved to wishlist"); }} className="mt-2 self-start text-xs text-muted underline-offset-2 hover:text-brand hover:underline">
                    Move to wishlist
                  </button>
                </div>
              </div>
            );
          })}
          <Link href="/shop" className="text-sm font-semibold text-brand hover:underline">← Continue Shopping</Link>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-base font-bold">Order Summary</h2>

          <div className="mb-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="h-10 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-brand"
            />
            <Button size="sm" onClick={applyCoupon} disabled={couponLoading}>{couponLoading ? "..." : "Apply"}</Button>
          </div>
          {appliedCoupon && (
            <p className="mb-3 text-xs font-medium text-success">Applied: {appliedCoupon.code} (-{appliedCoupon.type === "percent" ? `${appliedCoupon.value}%` : formatPrice(appliedCoupon.value)})</p>
          )}

          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">Shipping Method</p>
            <div className="flex flex-col gap-2">
              {[
                { value: "standard" as const, label: "Standard (5-7 days)", price: subtotal > 200 ? 0 : 9.99 },
                { value: "express" as const, label: "Express (2-3 days)", price: 19.99 },
              ].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                  <span className="flex items-center gap-2">
                    <input type="radio" name="shipping" checked={shippingMethod === opt.value} onChange={() => setShippingMethod(opt.value)} className="accent-brand" />
                    {opt.label}
                  </span>
                  <span className="font-medium">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Estimated Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <Link href="/checkout">
            <Button size="lg" className="mt-5 w-full">Proceed to Checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
