"use client";

import { useState } from "react";
import { toast } from "sonner";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/components/common/pagination";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminListProducts, adminSetStock } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  // lowest stock first, so what needs restocking is always at the top
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "inventory", page],
    queryFn: () => adminListProducts(undefined, page, 20, "stock-asc"),
    placeholderData: keepPreviousData,
  });

  const setStock = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => adminSetStock(id, stock),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["admin"] }); void queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Stock updated"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Inventory</h1>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Stock</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody>
              {isLoading && [0, 1, 2].map((i) => <tr key={i}><td colSpan={4} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>)}
              {data?.items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted">{p.sku}</td>
                  <td className="p-3">
                    <input
                      key={`${p.id}-${p.stock}`}
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      aria-label={`Stock for ${p.name}`}
                      onBlur={(e) => {
                        const next = Number(e.target.value);
                        if (Number.isInteger(next) && next >= 0 && next !== p.stock) setStock.mutate({ id: p.id, stock: next });
                        else e.target.value = String(p.stock);
                      }}
                      className="w-20 rounded-lg border border-border px-2 py-1 text-sm outline-none focus:border-brand"
                    />
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock <= 10 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {p.stock === 0 ? "Out of stock" : p.stock <= 10 ? "Low stock" : "In stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
