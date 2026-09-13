"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/button";
import { categories } from "@/mocks/categories";

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Categories ({categories.length})</h1>
        <Button size="sm" onClick={() => toast.info("Category creation is not available in this demo")}><Plus size={14} /> Add Category</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Products</th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted">/{c.slug}</td>
                <td className="p-3">{c.productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
