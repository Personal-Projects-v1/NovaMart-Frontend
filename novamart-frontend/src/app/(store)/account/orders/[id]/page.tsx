"use client";

import { use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Download, RotateCcw, XCircle, RefreshCw, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/common/button";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import { cancelOrder, getOrder } from "@/services/api/order.service";
import { errorMessage } from "@/services/api/client";
import { useCartStore } from "@/store/cart.store";
import { SkeletonLine, ErrorState } from "@/components/common/states";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { data: order, isLoading, isError, refetch } = useQuery({ queryKey: ["me", "order", id], queryFn: () => getOrder(id) });
  const cancel = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["me", "order", id], updated);
      void queryClient.invalidateQueries({ queryKey: ["me", "orders"] });
      toast.success("Order cancelled");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isLoading) return <div className="flex flex-col gap-4"><SkeletonLine className="h-10 w-64" /><SkeletonLine className="h-64 w-full" /></div>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!order) notFound();

  const canCancel = ["processing", "confirmed", "packed"].includes(order.status);
  const canReturn = order.status === "delivered";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Order {order.orderNumber}</h2>
          <p className="text-sm text-muted">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border p-5">
            <h3 className="mb-4 text-sm font-bold">Order Timeline</h3>
            <OrderTimeline timeline={order.timeline} />
          </div>

          <div className="rounded-2xl border border-border p-5">
            <h3 className="mb-4 text-sm font-bold">Items</h3>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                  {order.status === "delivered" && item.productSlug && (
                    <Link href={`/product/${item.productSlug}#reviews`}>
                      <Button variant="outline" size="sm">
                        <Star size={12} /> Review
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}> <Download size={14} /> Print Invoice</Button>
            {canCancel && (
              <Button variant="outline" disabled={cancel.isPending} onClick={() => { if (window.confirm("Cancel this order?")) cancel.mutate(); }}> <XCircle size={14} /> {cancel.isPending ? "Cancelling..." : "Cancel Order"}</Button>
            )}
            {canReturn && (
              <Link href={`/account/orders/${order.id}/return`}>
                <Button variant="outline"><RotateCcw size={14} /> Request Return</Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => {
                order.items.filter((i) => i.productId).forEach((i) => addItem(i.productId, i.quantity, i.selectedVariants));
                toast.success("Items added to cart");
                openCart();
              }}
            > <RefreshCw size={14} /> Buy Again</Button>
            <Link href="/support"><Button variant="outline"><MessageCircle size={14} /> Contact Support</Button></Link>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border p-5">
            <h3 className="mb-2 text-sm font-bold">Shipping Address</h3>
            <p className="text-sm text-muted">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}, {order.shippingAddress.city}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h3 className="mb-2 text-sm font-bold">Payment</h3>
            <p className="text-sm text-muted">{order.paymentMethod}</p>
            <p className="text-sm text-muted">{order.shippingMethod}</p>
            {order.trackingNumber && <p className="mt-1 text-xs text-muted">Tracking: {order.trackingNumber}</p>}
          </div>
          <div className="rounded-2xl border border-border p-5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(order.tax)}</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
