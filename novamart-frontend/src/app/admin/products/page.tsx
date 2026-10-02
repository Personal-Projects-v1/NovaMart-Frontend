"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { Pagination } from "@/components/common/pagination";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminDeleteProduct, adminListProducts } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  // wait for a pause in typing before querying the API
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(query); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "products", debounced, page],
    queryFn: () => adminListProducts(debounced || undefined, page, 15),
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["admin"] }); void queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Products {data ? `(${data.total})` : ""}</h1>
        <Link href="/admin/products/new"><Button size="sm"><Plus size={14} /> Add Product</Button></Link>
      </div>

      <div className="flex h-10 max-w-sm items-center gap-2 rounded-full border border-border bg-white px-3">
        <Search size={14} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full text-sm outline-none" />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && [0, 1, 2, 3].map((i) => <tr key={i}><td colSpan={6} className="p-3"><SkeletonLine className="h-10 w-full" /></td></tr>)}
              {data?.items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="flex items-center gap-2 p-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface">
                      <Image src={p.thumbnail} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 max-w-[200px] font-medium">{p.name}</span>
                  </td>
                  <td className="p-3 text-muted">{p.brand.name}</td>
                  <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {p.active ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Pencil size={14} /></Link>
                      <button
                        aria-label="Delete"
                        disabled={remove.isPending}
                        onClick={() => { if (window.confirm(`Delete "${p.name}"? This can't be undone.`)) remove.mutate(p.id); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
