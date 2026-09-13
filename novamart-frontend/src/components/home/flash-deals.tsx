"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { formatPrice } from "@/lib/utils";
import type { FlashDeal, ProductWithRelations } from "@/types";
import { Button } from "@/components/common/button";

function Pill({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-foreground px-2 py-1 text-white">
      <span className="text-sm font-bold tabular-nums leading-none">{value.toString().padStart(2, "0")}</span>
      <span className="text-[9px] uppercase leading-none text-white/60">{label}</span>
    </div>
  );
}

function DealCard({ deal, product }: { deal: FlashDeal; product: ProductWithRelations }) {
  const { hours, minutes, seconds, expired } = useCountdown(deal.endsAt);
  const addToCart = useAddToCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-surface">
        <Image src={product.thumbnail} alt={product.name} fill sizes="220px" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
          -{Math.round(((product.price - deal.dealPrice) / product.price) * 100)}%
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-1 text-sm font-semibold hover:text-brand">{product.name}</Link>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-brand">{formatPrice(deal.dealPrice)}</span>
          <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-brand" style={{ width: `${deal.claimedPercent}%` }} />
        </div>
        <p className="text-[11px] text-muted">{deal.claimedPercent}% claimed</p>
        {!expired ? (
          <div className="flex items-center gap-1.5">
            <Pill value={hours} label="hr" />
            <span className="text-muted">:</span>
            <Pill value={minutes} label="min" />
            <span className="text-muted">:</span>
            <Pill value={seconds} label="sec" />
          </div>
        ) : (
          <p className="text-xs font-semibold text-muted">Deal ended</p>
        )}
        <Button size="sm" disabled={expired || product.stock <= 0} onClick={() => addToCart(product, 1)} className="mt-1">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export function FlashDealsSection({ deals }: { deals: (FlashDeal & { product: ProductWithRelations })[] }) {
  return (
    <section className="container-shell py-10">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"><Zap size={18} /></span>
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Flash Deals</h2>
            <p className="text-sm text-muted">Grab these before the timer runs out.</p>
          </div>
        </div>
        <Link href="/deals" className="text-sm font-semibold text-brand hover:underline">See all deals</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} product={deal.product} />
        ))}
      </div>
    </section>
  );
}
