"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { flashDeals } from "@/mocks/misc";
import { productById } from "@/mocks/products";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminPromotionsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Promotions</h1>
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> New Promotion</Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><Zap size={16} className="text-brand" /> Active Flash Sales</h2>
        <div className="flex flex-col gap-2">
          {flashDeals.map((deal) => {
            const product = productById(deal.productId);
            return (
              <div key={deal.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span>{product?.name}</span>
                <span className="text-muted">Ends {formatDate(deal.endsAt)}</span>
                <span className="font-semibold text-brand">{formatPrice(deal.dealPrice)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Create promotion">
        <h2 className="mb-4 text-lg font-bold">Create Promotion</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Promotion created"); setOpen(false); }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Promotion Name</span><input required className="input" /></label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Type</span>
            <select className="input"><option>Flash Sale</option><option>Percentage Discount</option><option>Fixed Discount</option></select>
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Discount Value</span><input type="number" className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Start Date</span><input type="date" className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">End Date</span><input type="date" className="input" /></label>
          <Button type="submit" className="sm:col-span-2">Create Promotion</Button>
        </form>
      </Modal>
    </div>
  );
}
