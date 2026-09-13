"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { orders as initialOrders } from "@/mocks/misc";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = ["processing", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Order status updated");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Orders ({orders.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-3 font-semibold"><Link href={`/admin/orders/${o.id}`} className="hover:text-brand">{o.orderNumber}</Link></td>
                <td className="p-3 text-muted">{formatDate(o.createdAt)}</td>
                <td className="p-3">{o.shippingAddress.fullName}</td>
                <td className="p-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="rounded-full border border-border bg-white px-2 py-1 text-xs font-medium"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="ml-2"><OrderStatusBadge status={o.status} /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
