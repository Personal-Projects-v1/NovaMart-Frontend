"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist.store";

export function WishlistButton({
  productId,
  productName,
  className,
  size = 18,
}: {
  productId: string;
  productName?: string;
  className?: string;
  size?: number;
}) {
  const isSaved = useWishlistStore((s) => s.isSaved(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isSaved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
        toast.success(isSaved ? `Removed ${productName ?? "item"} from wishlist` : `Added ${productName ?? "item"} to wishlist`);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white",
        className
      )}
    >
      <Heart size={size} className={cn("transition-colors", isSaved ? "fill-brand text-brand" : "text-foreground")} />
    </button>
  );
}
