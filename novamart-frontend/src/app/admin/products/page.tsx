"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/button";
import { products as initialProducts } from "@/mocks/products";
import { brands } from "@/mocks/brands";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Products ({products.length})</h1>
        <Link href="/admin/products/new"><Button size="sm"><Plus size={14} /> Add Product</Button></Link>
      </div>

      <div className="flex h-10 max-w-sm items-center gap-2 rounded-full border border-border bg-white px-3">
        <Search size={14} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full text-sm outline-none" />
      </div>

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
            {filtered.map((p) => {
              const brand = brands.find((b) => b.id === p.brandId);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="flex items-center gap-2 p-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface">
                      <Image src={p.thumbnail} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 max-w-[200px] font-medium">{p.name}</span>
                  </td>
                  <td className="p-3 text-muted">{brand?.name}</td>
                  <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock > 0 ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Pencil size={14} /></Link>
                      <button onClick={() => remove(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
