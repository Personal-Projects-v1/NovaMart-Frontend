"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminGetOrder, adminUpdateOrderStatus } from "@/services/api/admin.service";
import { ApiError, errorMessage } from "@/services/api/client";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const NEXT_STEPS: Partial<Record<OrderStatus, { value: OrderStatus; label: string }[]>> = {
  processing: [{ value: "packed", label: "Mark packed" }, { value: "shipped", label: "Mark shipped" }, { value: "cancelled", label: "Cancel" }],
  confirmed: [{ value: "packed", label: "Mark packed" }, { value: "shipped", label: "Mark shipped" }, { value: "cancelled", label: "Cancel" }],
  packed: [{ value: "shipped", label: "Mark shipped" }, { value: "cancelled", label: "Cancel" }],
  shipped: [{ value: "out-for-delivery", label: "Out for delivery" }, { value: "delivered", label: "Mark delivered" }],
  "out-for-delivery": [{ value: "delivered", label: "Mark delivered" }],
  delivered: [{ value: "returned", label: "Mark returned" }],
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: order, isLoading, error, refetch } = useQuery({ queryKey: ["admin", "order", id], queryFn: () => adminGetOrder(id), retry: false });

  const update = useMutation({
    mutationFn: (status: OrderStatus) => adminUpdateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin", "order", id], updated);
      void queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isLoading) return <SkeletonLine className="h-96 w-full" />;
  if (error instanceof ApiError && error.status === 404) notFound();
  if (error || !order) return <ErrorState onRetry={() => refetch()} />;

  const actions = NEXT_STEPS[order.status] ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted">Placed {formatDate(order.createdAt)}{order.trackingNumber ? ` · Tracking ${order.trackingNumber}` : ""}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.value}
              disabled={update.isPending}
              onClick={() => { if (a.value !== "cancelled" && a.value !== "returned" || window.confirm(`${a.label} this order?`)) update.mutate(a.value); }}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Timeline</h2>
            <OrderTimeline timeline={order.timeline} />
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Items</h2>
            <div className="flex flex-col gap-3">
              {order.items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <span className="flex-1">{i.name} <span className="text-muted">× {i.quantity}</span></span>
                  <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h2 className="mb-2 text-sm font-bold">Customer</h2>
            <p>{order.shippingAddress.fullName}{!order.customerId && <span className="ml-1 text-xs text-muted">(guest)</span>}</p>
            {order.contactEmail && <p className="text-muted">{order.contactEmail}</p>}
            <p className="text-muted">{order.shippingAddress.phone}</p>
            <p className="mt-2 text-muted">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h2 className="mb-2 text-sm font-bold">Payment</h2>
            <p>{order.paymentMethod}</p>
            <p className="text-muted">{order.shippingMethod}</p>
            <div className="mt-3 space-y-1 border-t border-border pt-3">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(order.tax)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
