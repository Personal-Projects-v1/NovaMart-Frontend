"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminCreateCoupon, adminDeleteCoupon, adminListCoupons, type CouponInput } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import { formatDate } from "@/lib/utils";

const blank = (): CouponInput & { expiresDate: string } => ({
  code: "", type: "percent", value: 10, minSubtotal: undefined, expiresAt: "", description: "", usageLimit: undefined,
  expiresDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
});

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading, isError, refetch } = useQuery({ queryKey: ["admin", "coupons"], queryFn: adminListCoupons });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank());

  const create = useMutation({
    // the date input has no time, so a coupon stays valid through the end of its last day
    mutationFn: () => adminCreateCoupon({ ...form, expiresAt: `${form.expiresDate}T23:59:59` }),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }); toast.success("Coupon created"); setOpen(false); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: adminDeleteCoupon,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }); toast.success("Coupon deleted"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Coupons ({coupons.length})</h1>
        <Button size="sm" onClick={() => { setForm(blank()); setOpen(true); }}><Plus size={14} /> New Coupon</Button>
      </div>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Used</th><th className="p-3">Expires</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-3"><SkeletonLine className="h-8 w-full" /></td></tr>}
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-mono font-semibold">{c.code}</td>
                  <td className="p-3 capitalize text-muted">{c.type}</td>
                  <td className="p-3">{c.type === "percent" ? `${c.value}%` : `$${c.value}`}{c.minSubtotal ? <span className="text-xs text-muted"> (min ${c.minSubtotal})</span> : null}</td>
                  <td className="p-3 text-muted">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td className="p-3 text-muted">{formatDate(c.expiresAt)}{c.expired && <span className="ml-1 text-xs font-semibold text-brand">Expired</span>}</td>
                  <td className="p-3 text-right">
                    <button aria-label="Delete" onClick={() => { if (window.confirm(`Delete coupon ${c.code}?`)) remove.mutate(c.id); }} className="text-brand hover:underline"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Create coupon">
        <h2 className="mb-4 text-lg font-bold">Create Coupon</h2>
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Code</span><input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input font-mono" /></label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} className="input"><option value="percent">Percentage</option><option value="fixed">Fixed Amount</option></select>
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Value</span><input required type="number" min={0.01} step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Minimum order ($, optional)</span><input type="number" min={0} value={form.minSubtotal ?? ""} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value ? Number(e.target.value) : undefined })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Expires</span><input required type="date" value={form.expiresDate} onChange={(e) => setForm({ ...form, expiresDate: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Usage limit (optional)</span><input type="number" min={1} value={form.usageLimit ?? ""} onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : undefined })} className="input" /></label>
          <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Description</span><input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" placeholder="Shown on the Deals page" /></label>
          <Button type="submit" className="sm:col-span-2" disabled={create.isPending}>{create.isPending ? "Creating..." : "Create Coupon"}</Button>
        </form>
      </Modal>
    </div>
  );
}
