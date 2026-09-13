import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import { orderById } from "@/mocks/misc";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Timeline</h2>
          <OrderTimeline timeline={order.timeline} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h2 className="mb-2 text-sm font-bold">Customer</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p className="text-muted">{order.shippingAddress.phone}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h2 className="mb-2 text-sm font-bold">Payment</h2>
            <p>{order.paymentMethod}</p>
            <p className="mt-2 font-bold">{formatPrice(order.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
