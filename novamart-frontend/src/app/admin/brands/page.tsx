"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/button";
import { brands } from "@/mocks/brands";

export default function AdminBrandsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Brands ({brands.length})</h1>
        <Button size="sm" onClick={() => toast.info("Brand creation is not available in this demo")}><Plus size={14} /> Add Brand</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Products</th><th className="p-3">Featured</th></tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 font-medium">{b.name}</td>
                <td className="p-3 text-muted">/{b.slug}</td>
                <td className="p-3">{b.productCount}</td>
                <td className="p-3">{b.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
