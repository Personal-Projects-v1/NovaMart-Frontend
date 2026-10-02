"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminCreateBrand, adminDeleteBrand, adminListBrands, adminUpdateBrand, type BrandInput } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import type { Brand } from "@/types";

const EMPTY: BrandInput = { name: "", logo: "", description: "", featured: false };

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const { data: brands = [], isLoading, isError, refetch } = useQuery({ queryKey: ["admin", "brands"], queryFn: adminListBrands });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState<BrandInput>(EMPTY);

  const done = (msg: string) => {
    void queryClient.invalidateQueries({ queryKey: ["admin"] });
    void queryClient.invalidateQueries({ queryKey: ["brands"] });
    toast.success(msg);
  };
  const save = useMutation({
    mutationFn: () => (editing ? adminUpdateBrand(editing.id, form) : adminCreateBrand(form)),
    onSuccess: () => { done(editing ? "Brand updated" : "Brand created"); setOpen(false); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({ mutationFn: adminDeleteBrand, onSuccess: () => done("Brand deleted"), onError: (e) => toast.error(errorMessage(e)) });

  function openForm(brand: Brand | null) {
    setEditing(brand);
    setForm(brand ? { name: brand.name, logo: brand.logo ?? "", description: brand.description, featured: brand.featured } : EMPTY);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Brands ({brands.length})</h1>
        <Button size="sm" onClick={() => openForm(null)}><Plus size={14} /> Add Brand</Button>
      </div>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Products</th><th className="p-3">Featured</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>}
              {brands.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3 text-muted">/{b.slug}</td>
                  <td className="p-3">{b.productCount}</td>
                  <td className="p-3">{b.featured ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button aria-label="Edit" onClick={() => openForm(b)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Pencil size={14} /></button>
                      <button aria-label="Delete" onClick={() => { if (window.confirm(`Delete ${b.name}?`)) remove.mutate(b.id); }} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Brand form">
        <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Brand" : "Add Brand"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4">
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Logo URL</span><input value={form.logo ?? ""} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="input" placeholder="https://..." /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Description</span><textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brand" /> Featured on the home page</label>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save Brand"}</Button>
        </form>
      </Modal>
    </div>
  );
}
