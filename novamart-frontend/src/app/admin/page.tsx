"use client";

import Link from "next/link";
import { AlertTriangle, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { getDashboard } from "@/services/api/admin.service";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getDashboard });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonLine className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <SkeletonLine key={i} className="h-28" />)}</div>
        <SkeletonLine className="h-64 w-full" />
      </div>
    );
  }
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const change = (t: { changePercent: number | null }) => t.changePercent ?? undefined;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store&apos;s performance (change vs. the previous 30 days)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(data.revenue.value)} change={change(data.revenue)} icon={DollarSign} />
        <StatCard label="Orders" value={String(data.orders.value)} change={change(data.orders)} icon={ShoppingCart} />
        <StatCard label="Customers" value={data.customers.value.toLocaleString()} change={change(data.customers)} icon={Users} />
        <StatCard label="Avg. Order Value" value={formatPrice(data.averageOrderValue)} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-muted">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="py-2.5 font-semibold"><Link href={`/admin/orders/${o.id}`} className="hover:text-brand">{o.orderNumber}</Link></td>
                    <td className="py-2.5 text-muted">{formatDate(o.createdAt)}</td>
                    <td className="py-2.5"><OrderStatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-right font-semibold">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold"><AlertTriangle size={16} className="text-warning" /> Low Stock</h2>
            <div className="flex flex-col gap-2">
              {data.lowStock.length === 0 && <p className="text-sm text-muted">Everything is well stocked.</p>}
              {data.lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="font-semibold text-warning">{p.stock === 0 ? "Out" : `${p.stock} left`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-3 text-base font-bold">Popular Products</h2>
            <div className="flex flex-col gap-2">
              {data.popular.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="text-muted">{p.reviewCount} reviews</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
