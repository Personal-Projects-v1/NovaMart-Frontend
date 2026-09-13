import Link from "next/link";
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { orders } from "@/mocks/misc";
import { products } from "@/mocks/products";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = revenue / (orders.length || 1);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const popular = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store&apos;s performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(revenue)} change={12.4} icon={DollarSign} />
        <StatCard label="Orders" value={String(orders.length)} change={8.1} icon={ShoppingCart} />
        <StatCard label="Customers" value="1,204" change={4.2} icon={Users} />
        <StatCard label="Avg. Order Value" value={formatPrice(avgOrder)} change={-2.1} icon={TrendingUp} />
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
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="py-2.5 font-semibold">{o.orderNumber}</td>
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
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="font-semibold text-warning">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-3 text-base font-bold">Popular Products</h2>
            <div className="flex flex-col gap-2">
              {popular.map((p) => (
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
