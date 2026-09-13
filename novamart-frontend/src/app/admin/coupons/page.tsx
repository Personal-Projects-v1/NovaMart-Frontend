"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { coupons as initialCoupons } from "@/mocks/misc";
import { formatDate } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [open, setOpen] = useState(false);

  function remove(code: string) {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    toast.success("Coupon deleted");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Coupons ({coupons.length})</h1>
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> New Coupon</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Expires</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} className="border-t border-border">
                <td className="p-3 font-mono font-semibold">{c.code}</td>
                <td className="p-3 capitalize text-muted">{c.type}</td>
                <td className="p-3">{c.type === "percent" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="p-3 text-muted">{formatDate(c.expiresAt)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(c.code)} className="text-brand hover:underline"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Create coupon">
        <h2 className="mb-4 text-lg font-bold">Create Coupon</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Coupon created"); setOpen(false); }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Code</span><input required className="input" /></label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Type</span>
            <select className="input"><option value="percent">Percentage</option><option value="fixed">Fixed Amount</option></select>
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Value</span><input type="number" className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Expires</span><input type="date" className="input" /></label>
          <Button type="submit" className="sm:col-span-2">Create Coupon</Button>
        </form>
      </Modal>
    </div>
  );
}
