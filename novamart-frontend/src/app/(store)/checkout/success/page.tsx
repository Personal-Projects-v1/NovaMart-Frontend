import Link from "next/link";
import { CheckCircle2, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/common/button";
import { formatDate } from "@/lib/utils";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order = "VX-000000" } = await searchParams;
  const eta = new Date(Date.now() + 6 * 86400000);

  return (
    <div className="container-shell flex justify-center py-12">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-muted">Thank you for shopping with Voltrix. Your order has been placed successfully.</p>

        <div className="mt-6 rounded-2xl bg-surface p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Order Number</span>
            <span className="font-bold">{order}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-center text-xs">
            <div>
              <Package size={16} className="mx-auto mb-1 text-brand" />
              <p className="font-semibold">Processing</p>
            </div>
            <div>
              <Truck size={16} className="mx-auto mb-1 text-muted" />
              <p className="text-muted">Est. delivery {formatDate(eta.toISOString())}</p>
            </div>
            <div>
              <CreditCard size={16} className="mx-auto mb-1 text-muted" />
              <p className="text-muted">Payment confirmed</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/track-order" className="flex-1"><Button variant="outline" className="w-full">Track Order</Button></Link>
          <Link href="/account/orders" className="flex-1"><Button variant="outline" className="w-full">View Orders</Button></Link>
          <Link href="/shop" className="flex-1"><Button className="w-full">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
