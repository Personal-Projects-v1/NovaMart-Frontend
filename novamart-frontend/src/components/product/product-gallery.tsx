"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        <Image src={images[active]} alt={name} fill sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" priority />
        <button
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
        >
          <Expand size={16} />
        </button>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface",
              active === i ? "border-brand" : "border-transparent"
            )}
          >
            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6" onClick={() => setFullscreen(false)}>
          <button aria-label="Close fullscreen" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X size={20} />
          </button>
          <div className="relative h-full w-full max-w-3xl">
            <Image src={images[active]} alt={name} fill sizes="800px" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
