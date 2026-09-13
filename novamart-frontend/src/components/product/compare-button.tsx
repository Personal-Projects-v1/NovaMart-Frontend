"use client";

import { Scale } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/compare.store";

export function CompareButton({
  productId,
  className,
  size = 18,
}: {
  productId: string;
  className?: string;
  size?: number;
}) {
  const isComparing = useCompareStore((s) => s.isComparing(productId));
  const toggle = useCompareStore((s) => s.toggle);

  return (
    <button
      type="button"
      aria-label={isComparing ? "Remove from compare" : "Add to compare"}
      aria-pressed={isComparing}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const result = toggle(productId);
        if (result.reason) toast.error(result.reason);
        else toast.success(result.added ? "Added to compare" : "Removed from compare");
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white",
        isComparing && "bg-foreground text-white hover:bg-foreground",
        className
      )}
    >
      <Scale size={size} />
    </button>
  );
}
