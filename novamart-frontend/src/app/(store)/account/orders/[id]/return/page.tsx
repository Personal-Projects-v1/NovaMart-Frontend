"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/common/button";
import { getOrder, requestReturn } from "@/services/api/order.service";
import { errorMessage } from "@/services/api/client";
import { SkeletonLine } from "@/components/common/states";
import { cn } from "@/lib/utils";

const REASONS = ["Damaged", "Wrong item", "Defective", "Not as described", "Changed my mind", "Other"];

export default function ReturnRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useQuery({ queryKey: ["me", "order", id], queryFn: () => getOrder(id) });
  const [step, setStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [refundMethod, setRefundMethod] = useState<"original" | "store-credit">("original");
  const [submitting, setSubmitting] = useState(false);

  const steps = ["Select Items", "Reason", "Details", "Refund Method", "Review"];

  async function submit() {
    if (!order) return;
    setSubmitting(true);
    try {
      const result = await requestReturn(order.id, { itemIds: selectedItems, reason, details: explanation, refundMethod });
      toast.success(`Return request ${result.returnId} submitted successfully.`);
      router.push(`/account/orders/${order.id}`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <SkeletonLine className="h-64 w-full" />;
  if (!order) notFound();
  if (order.status !== "delivered") {
    return <p className="text-sm text-muted">Only delivered orders can be returned. <button onClick={() => router.back()} className="font-semibold text-brand hover:underline">Go back</button></p>;
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold">Return Request — {order.orderNumber}</h2>
      <p className="mb-6 text-sm text-muted">Step {step + 1} of {steps.length}: {steps[step]}</p>

      {step === 0 && (
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => setSelectedItems(e.target.checked ? [...selectedItems, item.id] : selectedItems.filter((i) => i !== item.id))}
                className="accent-brand"
              />
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </label>
          ))}
          <Button className="mt-2 self-start" disabled={selectedItems.length === 0} onClick={() => setStep(1)}>Continue</Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={cn("flex items-center justify-between rounded-xl border p-3 text-left text-sm", reason === r ? "border-brand bg-brand-soft" : "border-border")}
            >
              {r} {reason === r && <Check size={16} className="text-brand" />}
            </button>
          ))}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button disabled={!reason} onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={5}
            placeholder="Please describe the issue in more detail..."
            className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          {[
            { value: "original" as const, label: "Refund to original payment method" },
            { value: "store-credit" as const, label: "Store credit (10% bonus)" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRefundMethod(opt.value)}
              className={cn("rounded-xl border p-3 text-left text-sm", refundMethod === opt.value ? "border-brand bg-brand-soft" : "border-border")}
            >
              {opt.label}
            </button>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-surface p-4 text-sm">
            <p><span className="font-semibold">Items:</span> {selectedItems.length} selected</p>
            <p><span className="font-semibold">Reason:</span> {reason}</p>
            <p><span className="font-semibold">Refund method:</span> {refundMethod === "original" ? "Original payment method" : "Store credit"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Return Request"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
