"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/common/button";
import { brands } from "@/mocks/brands";
import { categories } from "@/mocks/categories";
import type { Product } from "@/types";

export function ProductForm({ initial }: { initial?: Partial<Product> }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    brandId: initial?.brandId ?? brands[0].id,
    categoryId: initial?.categoryId ?? categories[0].id,
    price: initial?.price ?? 0,
    compareAtPrice: initial?.compareAtPrice ?? 0,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
    status: initial?.stock && initial.stock > 0 ? "published" : "draft",
    shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "",
    metaTitle: initial?.name ?? "",
    metaDescription: initial?.shortDescription ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success(initial ? "Product updated" : "Product created");
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Basic Information</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Product Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">SKU</span><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Short Description</span><textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Full Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Pricing & Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Price</span><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Compare-at Price</span><input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Stock</span><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Images</h2>
          <div className="flex flex-wrap gap-3">
            {(initial?.images ?? []).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt="" className="h-20 w-20 rounded-xl object-cover" />
            ))}
            <button type="button" onClick={() => toast.info("Image upload is not available in this demo")} className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border text-xs text-muted">
              + Add
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">SEO</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Meta Title</span><input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Meta Description</span><textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Organize</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Category</span>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Brand</span>
              <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="input">
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
        </div>
        <Button type="submit" size="lg">{initial ? "Save Changes" : "Create Product"}</Button>
      </div>
    </form>
  );
}
