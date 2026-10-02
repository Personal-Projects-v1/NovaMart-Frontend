"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { useBrands, useCategories } from "@/hooks/use-catalog";
import { adminCreateProduct, adminUpdateProduct, type ProductInput } from "@/services/api/admin.service";
import { ApiError, errorMessage } from "@/services/api/client";
import type { Product } from "@/types";

export function ProductForm({ initial }: { initial?: Partial<Product> & { id?: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { brands } = useBrands();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    brandId: initial?.brandId ?? "",
    categoryId: initial?.categoryId ?? "",
    price: initial?.price ?? 0,
    compareAtPrice: initial?.compareAtPrice ?? 0,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
    active: initial?.active ?? true,
    featured: initial?.featured ?? false,
    shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "",
    images: (initial?.images ?? []).join("\n"),
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: () => {
      const images = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
      const input: ProductInput = {
        name: form.name,
        sku: form.sku || undefined,
        brandId: form.brandId || brands[0]?.id,
        categoryId: form.categoryId || categories[0]?.id,
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice) || undefined,
        stock: Number(form.stock),
        shortDescription: form.shortDescription,
        description: form.description,
        images,
        thumbnail: images[0],
        active: form.active,
        featured: form.featured,
      };
      return initial?.id ? adminUpdateProduct(initial.id, input) : adminCreateProduct(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(initial?.id ? "Product updated" : "Product created");
      router.push("/admin/products");
    },
    onError: (e) => {
      setFieldErrors(e instanceof ApiError && e.fieldErrors ? e.fieldErrors : {});
      toast.error(errorMessage(e));
    },
  });

  const err = (key: string) => fieldErrors[key] && <span className="text-xs text-brand">{fieldErrors[key]}</span>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); setFieldErrors({}); save.mutate(); }} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Basic Information</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Product Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />{err("name")}</label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">SKU (generated if left empty)</span><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Short Description</span><textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Full Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Pricing & Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Price ($)</span><input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" required />{err("price")}</label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Compare-at Price ($, 0 = none)</span><input type="number" min={0} step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} className="input" />{err("compareAtPrice")}</label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Stock</span><input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" required />{err("stock")}</label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-1 text-sm font-bold">Images</h2>
          <p className="mb-3 text-xs text-muted">One image URL per line. The first one is the thumbnail. (File upload isn&apos;t available yet.)</p>
          <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={4} placeholder="https://..." className="w-full rounded-xl border border-border p-3 font-mono text-xs outline-none focus:border-brand" />
          <div className="mt-3 flex flex-wrap gap-3">
            {form.images.split("\n").map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s)).slice(0, 6).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt="" className="h-20 w-20 rounded-xl object-cover" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Organize</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Category</span>
              <select value={form.categoryId || categories[0]?.id || ""} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Brand</span>
              <select value={form.brandId || brands[0]?.id || ""} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="input">
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Status</span>
              <select value={form.active ? "published" : "draft"} onChange={(e) => setForm({ ...form, active: e.target.value === "published" })} className="input">
                <option value="draft">Draft (hidden from the store)</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brand" /> Featured product</label>
          </div>
        </div>
        <Button type="submit" size="lg" disabled={save.isPending}>{save.isPending ? "Saving..." : initial?.id ? "Save Changes" : "Create Product"}</Button>
      </div>
    </form>
  );
}
