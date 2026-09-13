import { mockUser, orders } from "@/mocks/misc";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = id === mockUser.id ? mockUser : { ...mockUser, id, firstName: "Customer", lastName: id };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-white p-5">
        <h1 className="text-xl font-bold">{customer.firstName} {customer.lastName}</h1>
        <p className="text-sm text-muted">{customer.email} · {customer.phone}</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-bold">Order History</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted">
            <tr><th className="pb-2">Order</th><th className="pb-2">Date</th><th className="pb-2">Status</th><th className="pb-2 text-right">Total</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
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
  );
}
