"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, PackageSearch } from "lucide-react";
import { Button } from "@/components/common/button";
import { OrderTimeline } from "@/components/account/order-timeline";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { trackOrder } from "@/services/api/order.service";
import { errorMessage } from "@/services/api/client";
import type { Order } from "@/types";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<Order | null | "not-found">(null);

  const [loading, setLoading] = useState(false);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !contact.trim()) {
      toast.error("Please enter your order number and email or phone.");
      return;
    }
    setLoading(true);
    try {
      const order = await trackOrder(orderNumber.trim(), contact.trim());
      setResult(order ?? "not-found");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-shell flex justify-center py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <PackageSearch size={36} className="mx-auto mb-2 text-brand" />
          <h1 className="text-2xl font-bold">Track Your Order</h1>
          <p className="text-sm text-muted">Enter your order number and email or phone to see its status.</p>
        </div>
        <form onSubmit={track} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Order number (e.g. VX-480000)" className="input" />
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Email or phone used at checkout" className="input" />
          <Button type="submit" disabled={loading}><Search size={14} /> {loading ? "Searching..." : "Track Order"}</Button>
        </form>

        {result === "not-found" && (
          <p className="mt-4 text-center text-sm text-brand">We couldn&apos;t find an order matching those details. Check the order number and the email or phone used at checkout.</p>
        )}

        {result && result !== "not-found" && (
          <div className="mt-6 rounded-2xl border border-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">{result.orderNumber}</span>
              <OrderStatusBadge status={result.status} />
            </div>
            <OrderTimeline timeline={result.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}
