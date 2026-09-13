import Link from "next/link";
import Image from "next/image";
import { Package, Heart, Sparkles } from "lucide-react";
import { mockUser, orders } from "@/mocks/misc";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { getRecommendedProducts } from "@/services/api/product.service";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const activeOrders = orders.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status));
  const recommended = await getRecommendedProducts(4);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl bg-surface p-6">
        <h2 className="text-lg font-bold">Welcome back, {mockUser.firstName}!</h2>
        <p className="text-sm text-muted">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold"><Package size={16} /> Active Orders</h3>
          <Link href="/account/orders" className="text-sm font-semibold text-brand hover:underline">View all</Link>
        </div>
        {activeOrders.length === 0 ? (
          <p className="text-sm text-muted">You have no active orders right now.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-brand">
                <div>
                  <p className="text-sm font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{formatDate(order.createdAt)} · {order.items.length} items · {formatPrice(order.total)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><Heart size={16} /> Recent Purchases</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {orders[0]?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-3 text-center">
              <div className="relative mx-auto mb-2 aspect-square w-full overflow-hidden rounded-lg bg-surface">
                <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
              </div>
              <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><Sparkles size={16} /> Recommended for You</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {recommended.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="rounded-xl border border-border p-3 text-center hover:border-brand">
              <div className="relative mx-auto mb-2 aspect-square w-full overflow-hidden rounded-lg bg-surface">
                <Image src={p.thumbnail} alt={p.name} fill sizes="120px" className="object-cover" />
              </div>
              <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
              <p className="text-xs font-bold text-brand">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
