import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types";

const BADGE_STYLES: Record<ProductBadge, string> = {
  new: "bg-emerald-600 text-white",
  sale: "bg-brand text-white",
  bestseller: "bg-amber-500 text-white",
  limited: "bg-purple-600 text-white",
  exclusive: "bg-foreground text-white",
  "free-shipping": "bg-sky-600 text-white",
};

const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "New",
  sale: "Sale",
  bestseller: "Best Seller",
  limited: "Limited Stock",
  exclusive: "Exclusive",
  "free-shipping": "Free Shipping",
};

export function ProductBadgePill({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
        BADGE_STYLES[badge],
        className
      )}
    >
      {BADGE_LABELS[badge]}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted", className)}>
      {children}
    </span>
  );
}
