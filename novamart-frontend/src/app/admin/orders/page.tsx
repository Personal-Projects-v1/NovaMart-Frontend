"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Pagination } from "@/components/common/pagination";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminListOrders, adminUpdateOrderStatus } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = ["processing", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(query); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "orders", status, debounced, page],
    queryFn: () => adminListOrders(status || undefined, debounced || undefined, page, 15),
    placeholderData: keepPreviousData,
  });

  const update = useMutation({
    mutationFn: ({ id, next }: { id: string; next: OrderStatus }) => adminUpdateOrderStatus(id, next),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["admin"] }); toast.success("Order status updated"); },
    // the rejected change (e.g. moving a delivered order back) is explained by the server
    onError: (e) => { toast.error(errorMessage(e)); void refetch(); },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Orders {data ? `(${data.total})` : ""}</h1>
      <div className="flex flex-wrap gap-3">
        <div className="flex h-10 w-72 max-w-full items-center gap-2 rounded-full border border-border bg-white px-3">
          <Search size={14} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Order #, customer or email..." className="w-full text-sm outline-none" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-10 rounded-full border border-border bg-white px-3 text-sm">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody>
              {isLoading && [0, 1, 2].map((i) => <tr key={i}><td colSpan={5} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>)}
              {data?.items.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-3 font-semibold"><Link href={`/admin/orders/${o.id}`} className="hover:text-brand">{o.orderNumber}</Link></td>
                  <td className="p-3 text-muted">{formatDate(o.createdAt)}</td>
                  <td className="p-3">{o.shippingAddress.fullName}{!o.customerId && <span className="ml-1 text-xs text-muted">(guest)</span>}</td>
                  <td className="p-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      disabled={update.isPending}
                      onChange={(e) => update.mutate({ id: o.id, next: e.target.value as OrderStatus })}
                      className="rounded-full border border-border bg-white px-2 py-1 text-xs font-medium"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="ml-2"><OrderStatusBadge status={o.status} /></span>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
