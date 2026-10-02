"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/common/pagination";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminListCustomers } from "@/services/api/admin.service";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(query); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "customers", debounced, page],
    queryFn: () => adminListCustomers(debounced || undefined, page, 15),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Customers {data ? `(${data.total})` : ""}</h1>
      <div className="flex h-10 max-w-sm items-center gap-2 rounded-full border border-border bg-white px-3">
        <Search size={14} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email..." className="w-full text-sm outline-none" />
      </div>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3">Orders</th><th className="p-3">Spent</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody>
              {isLoading && [0, 1, 2].map((i) => <tr key={i}><td colSpan={6} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>)}
              {data?.items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-medium"><Link href={`/admin/customers/${c.id}`} className="hover:text-brand">{c.firstName} {c.lastName}</Link></td>
                  <td className="p-3 text-muted">{c.email}</td>
                  <td className="p-3 text-muted">{formatDate(c.createdAt)}</td>
                  <td className="p-3">{c.orderCount}</td>
                  <td className="p-3 font-semibold">{formatPrice(c.totalSpent)}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{c.enabled ? "Active" : "Disabled"}</span></td>
                </tr>
              ))}
              {data && data.items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted">No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
