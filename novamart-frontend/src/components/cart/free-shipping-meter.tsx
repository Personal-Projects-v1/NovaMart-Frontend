import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/** Mirrors the server rule: standard shipping is free when the subtotal is over this amount. */
export const FREE_SHIPPING_THRESHOLD = 200;

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0 || subtotal > FREE_SHIPPING_THRESHOLD;

  return (
    <div className="mb-4 rounded-xl bg-surface p-3.5">
      <p className="flex items-center gap-2 text-xs font-medium">
        <Truck size={15} className={unlocked ? "text-success" : "text-brand"} />
        {unlocked ? (
          <span className="text-success">You&apos;ve unlocked free shipping!</span>
        ) : (
          <span>Add <strong>{formatPrice(remaining)}</strong> more for free shipping</span>
        )}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-success" : "bg-brand"}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
