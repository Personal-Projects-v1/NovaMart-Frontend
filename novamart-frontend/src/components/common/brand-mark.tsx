import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

/**
 * A brand's logo when one has been uploaded, otherwise a clean monogram. We don't ship third-party
 * trademarks, so the demo brands are shown as monograms and wordmarks.
 */
export function BrandMark({ brand, size = 40, className }: { brand: Pick<Brand, "name" | "logo">; size?: number; className?: string }) {
  if (brand.logo) {
    return (
      <span className={cn("relative block shrink-0 overflow-hidden rounded-full bg-surface", className)} style={{ width: size, height: size }}>
        <Image src={brand.logo} alt={brand.name} fill sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }
  const initials = brand.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-foreground font-display font-bold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
