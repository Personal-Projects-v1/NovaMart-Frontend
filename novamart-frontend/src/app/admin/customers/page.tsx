import Link from "next/link";
import { mockUser, orders } from "@/mocks/misc";
import { formatDate, formatPrice } from "@/lib/utils";

const CUSTOMERS = [
  { ...mockUser, totalSpent: orders.reduce((s, o) => s + o.total, 0), orderCount: orders.length },
  { id: "u-2", firstName: "Jean", lastName: "P.", email: "jean.p@example.com", createdAt: "2025-01-10", totalSpent: 1240, orderCount: 3 },
  { id: "u-3", firstName: "Grace", lastName: "M.", email: "grace.m@example.com", createdAt: "2025-03-22", totalSpent: 890, orderCount: 2 },
  { id: "u-4", firstName: "Eric", lastName: "N.", email: "eric.n@example.com", createdAt: "2024-11-05", totalSpent: 2310, orderCount: 6 },
];

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Customers ({CUSTOMERS.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3">Orders</th><th className="p-3">Spent</th></tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium"><Link href={`/admin/customers/${c.id}`} className="hover:text-brand">{c.firstName} {c.lastName}</Link></td>
                <td className="p-3 text-muted">{c.email}</td>
                <td className="p-3 text-muted">{formatDate(c.createdAt)}</td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3 font-semibold">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
