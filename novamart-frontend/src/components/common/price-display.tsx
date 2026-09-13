import { cn, discountPercent, formatPrice } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const percent = discountPercent(price, compareAtPrice);
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold text-foreground", sizes[size])}>{formatPrice(price)}</span>
      {percent > 0 && (
        <>
          <span className="text-sm text-muted line-through">{formatPrice(compareAtPrice!)}</span>
          <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand">
            -{percent}%
          </span>
        </>
      )}
    </div>
  );
}
