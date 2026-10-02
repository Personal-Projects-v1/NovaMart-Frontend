"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminCreateCategory, adminDeleteCategory, adminListCategories, adminUpdateCategory, type CategoryInput } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import type { Category } from "@/types";

const EMPTY: CategoryInput = { name: "", description: "", image: "", icon: "Package" };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading, isError, refetch } = useQuery({ queryKey: ["admin", "categories"], queryFn: adminListCategories });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);

  const done = (msg: string) => {
    void queryClient.invalidateQueries({ queryKey: ["admin"] });
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
    toast.success(msg);
  };
  const save = useMutation({
    mutationFn: () => (editing ? adminUpdateCategory(editing.id, form) : adminCreateCategory(form)),
    onSuccess: () => { done(editing ? "Category updated" : "Category created"); setOpen(false); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({ mutationFn: adminDeleteCategory, onSuccess: () => done("Category deleted"), onError: (e) => toast.error(errorMessage(e)) });

  function openForm(c: Category | null) {
    setEditing(c);
    setForm(c ? { name: c.name, description: c.description, image: c.image, icon: c.icon, parentId: c.parentId ?? null } : EMPTY);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Categories ({categories.length})</h1>
        <Button size="sm" onClick={() => openForm(null)}><Plus size={14} /> Add Category</Button>
      </div>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Products</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>}
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted">/{c.slug}</td>
                  <td className="p-3">{c.productCount}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button aria-label="Edit" onClick={() => openForm(c)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Pencil size={14} /></button>
                      <button aria-label="Delete" onClick={() => { if (window.confirm(`Delete ${c.name}?`)) remove.mutate(c.id); }} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Category form">
        <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4">
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Image URL</span><input value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Icon (lucide name, e.g. Laptop)</span><input value={form.icon ?? ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Description</span><textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save Category"}</Button>
        </form>
      </Modal>
    </div>
  );
}
