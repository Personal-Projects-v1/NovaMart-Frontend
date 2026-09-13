"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { Drawer } from "@/components/common/modal";
import { Button } from "@/components/common/button";
import { QuantitySelector } from "@/components/common/quantity-selector";
import { EmptyState } from "@/components/common/states";
import { useCartStore } from "@/store/cart.store";
import { productById } from "@/mocks/products";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const lines = items
    .map((item) => ({ item, product: productById(item.productId) }))
    .filter((l): l is { item: typeof items[number]; product: NonNullable<ReturnType<typeof productById>> } => !!l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()} title="Shopping cart">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <ShoppingBag size={18} /> Your Cart ({lines.length})
        </h2>
        <button onClick={closeCart} aria-label="Close cart" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse our catalog and add products you love."
            action={
              <Link href="/shop" onClick={closeCart}>
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {lines.map(({ item, product }) => {
              const overStock = item.quantity > product.stock;
              return (
                <div key={item.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
                  <Link href={`/product/${product.slug}`} onClick={closeCart} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image src={product.thumbnail} alt={product.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${product.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-semibold hover:text-brand">
                        {product.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="shrink-0 text-muted hover:text-brand">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {Object.keys(item.selectedVariants).length > 0 && (
                      <p className="mt-0.5 text-xs text-muted">
                        {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    )}
                    {product.stock === 0 ? (
                      <p className="mt-1 text-xs font-medium text-brand">Out of stock</p>
                    ) : overStock ? (
                      <p className="mt-1 text-xs font-medium text-warning">Only {product.stock} left — quantity adjusted</p>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between">
                      <QuantitySelector
                        size="sm"
                        value={item.quantity}
                        max={product.stock || 1}
                        onChange={(q) => updateQuantity(item.id, q)}
                      />
                      <span className="text-sm font-bold">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Moved to wishlist");
                      }}
                      className="mt-1 self-start text-xs text-muted underline-offset-2 hover:text-brand hover:underline"
                    >
                      Move to wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lines.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="text-base font-bold text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <p className="mb-3 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
          <Link href="/checkout" onClick={closeCart}>
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
          <Link href="/cart" onClick={closeCart}>
            <Button variant="outline" className="mt-2 w-full" size="lg">View Cart</Button>
          </Link>
        </div>
      )}
    </Drawer>
  );
}
