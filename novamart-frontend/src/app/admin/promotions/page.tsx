"use client";

import { useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminCreatePromotion, adminDeletePromotion, adminListPromotions, adminListProducts } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import { formatDate, formatPrice } from "@/lib/utils";

const inHours = (h: number) => new Date(Date.now() + h * 3600000).toISOString().slice(0, 16);

export default function AdminPromotionsPage() {
  const queryClient = useQueryClient();
  const { data: deals = [], isLoading, isError, refetch } = useQuery({ queryKey: ["admin", "promotions"], queryFn: adminListPromotions });
  const { data: productPage } = useQuery({ queryKey: ["admin", "product-options"], queryFn: () => adminListProducts(undefined, 1, 100) });
  const products = productPage?.items ?? [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: "", dealPrice: 0, endsAt: inHours(24) });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
    void queryClient.invalidateQueries({ queryKey: ["flash-deals"] });
  };
  const create = useMutation({
    mutationFn: () => adminCreatePromotion({ productId: form.productId || products[0]?.id, dealPrice: Number(form.dealPrice), endsAt: `${form.endsAt}:00` }),
    onSuccess: () => { refresh(); toast.success("Promotion created"); setOpen(false); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: adminDeletePromotion,
    onSuccess: () => { refresh(); toast.success("Promotion removed"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Promotions</h1>
        <Button size="sm" onClick={() => { setForm({ productId: products[0]?.id ?? "", dealPrice: 0, endsAt: inHours(24) }); setOpen(true); }}><Plus size={14} /> New Flash Sale</Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><Zap size={16} className="text-brand" /> Flash Sales</h2>
        {isError ? <ErrorState onRetry={() => refetch()} /> : (
          <div className="flex flex-col gap-2">
            {isLoading && <SkeletonLine className="h-12 w-full" />}
            {!isLoading && deals.length === 0 && <p className="text-sm text-muted">No flash sales yet.</p>}
            {deals.map((deal) => (
              <div key={deal.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                <span className="font-medium">{deal.productName}</span>
                <span className="text-muted">{deal.ended ? "Ended" : "Ends"} {formatDate(deal.endsAt)}</span>
                <span className="font-semibold text-brand">{formatPrice(deal.dealPrice)}</span>
                <button aria-label="Delete" onClick={() => remove.mutate(deal.id)} className="text-muted hover:text-brand"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Create flash sale">
        <h2 className="mb-4 text-lg font-bold">Create Flash Sale</h2>
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold">Product</span>
            <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="input">
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.price)})</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Deal price ($)</span><input required type="number" min={0.01} step="0.01" value={form.dealPrice} onChange={(e) => setForm({ ...form, dealPrice: Number(e.target.value) })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Ends</span><input required type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="input" /></label>
          <Button type="submit" className="sm:col-span-2" disabled={create.isPending}>{create.isPending ? "Creating..." : "Create Flash Sale"}</Button>
        </form>
      </Modal>
    </div>
  );
}
