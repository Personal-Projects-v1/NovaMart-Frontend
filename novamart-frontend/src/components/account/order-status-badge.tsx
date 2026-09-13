import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  processing: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  packed: "bg-sky-100 text-sky-700",
  shipped: "bg-indigo-100 text-indigo-700",
  "out-for-delivery": "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-gray-200 text-gray-700",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
