"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { EmptyState, ErrorState, SkeletonLine } from "@/components/common/states";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/services/api/order.service";
import { formatDate, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const { data: orders = [], isLoading, isError, refetch } = useQuery({ queryKey: ["me", "orders"], queryFn: listOrders });
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium", tab === t.value ? "bg-foreground text-white" : "bg-surface text-foreground hover:bg-surface-strong")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <SkeletonLine key={i} className="h-20 w-full" />)}</div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders found" description="Orders matching this filter will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 hover:border-brand">
              <div>
                <p className="text-sm font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-muted">Placed {formatDate(order.createdAt)} · {order.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
