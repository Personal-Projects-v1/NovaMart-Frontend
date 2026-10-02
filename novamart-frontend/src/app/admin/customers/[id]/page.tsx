"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/common/button";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminGetCustomer, adminSetCustomerEnabled } from "@/services/api/admin.service";
import { ApiError, errorMessage } from "@/services/api/client";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["admin", "customer", id], queryFn: () => adminGetCustomer(id), retry: false });

  const toggle = useMutation({
    mutationFn: (enabled: boolean) => adminSetCustomerEnabled(id, enabled),
    onSuccess: (_c, enabled) => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(enabled ? "Account enabled" : "Account disabled - they've been signed out");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isLoading) return <SkeletonLine className="h-80 w-full" />;
  if (error instanceof ApiError && error.status === 404) notFound();
  if (error || !data) return <ErrorState onRetry={() => refetch()} />;
  const { customer, orders } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-white p-5">
        <div>
          <h1 className="text-xl font-bold">{customer.firstName} {customer.lastName}</h1>
          <p className="text-sm text-muted">{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</p>
          <p className="mt-1 text-xs text-muted">Joined {formatDate(customer.createdAt)} · {customer.orderCount} orders · {formatPrice(customer.totalSpent)} spent{customer.emailVerified ? "" : " · email not verified"}</p>
        </div>
        <Button variant="outline" size="sm" disabled={toggle.isPending} onClick={() => toggle.mutate(!customer.enabled)}>
          {customer.enabled ? "Disable account" : "Enable account"}
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-bold">Order History</h2>
        {orders.length === 0 ? <p className="text-sm text-muted">No orders yet.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr><th className="pb-2">Order</th><th className="pb-2">Date</th><th className="pb-2">Status</th><th className="pb-2 text-right">Total</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="py-2.5 font-semibold"><Link href={`/admin/orders/${o.id}`} className="hover:text-brand">{o.orderNumber}</Link></td>
                  <td className="py-2.5 text-muted">{formatDate(o.createdAt)}</td>
                  <td className="py-2.5"><OrderStatusBadge status={o.status} /></td>
                  <td className="py-2.5 text-right font-semibold">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
