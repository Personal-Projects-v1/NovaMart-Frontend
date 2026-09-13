"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  theme: "light" | "dark";
}

const SLIDES: Slide[] = [
  {
    id: "latest-tech",
    eyebrow: "Discover. Shop. Upgrade.",
    title: "Latest Tech,",
    highlight: "Made for You",
    description: "Explore cutting-edge phones, laptops and audio that upgrade your everyday.",
    cta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Browse Collections", href: "/deals" },
    image: "https://picsum.photos/seed/hero-latest-tech/1200/1000",
    theme: "light",
  },
  {
    id: "gaming-setup",
    eyebrow: "Level Up",
    title: "Build Your Ultimate",
    highlight: "Gaming Setup",
    description: "Monitors, mechanical keyboards and laptops built for competitive play.",
    cta: { label: "Shop Gaming", href: "/category/gaming" },
    secondaryCta: { label: "See Bundles", href: "/collections/gaming-setup" },
    image: "https://picsum.photos/seed/hero-gaming/1200/1000",
    theme: "dark",
  },
  {
    id: "smartphone-launch",
    eyebrow: "Just Launched",
    title: "Meet the",
    highlight: "Aurora Pro 15",
    description: "Titanium build, pro camera system and all-day battery life.",
    cta: { label: "Pre-order Now", href: "/product/aurora-pro-15-smartphone" },
    secondaryCta: { label: "Learn More", href: "/category/phones" },
    image: "https://picsum.photos/seed/hero-smartphone/1200/1000",
    theme: "light",
  },
  {
    id: "weekend-deals",
    eyebrow: "Limited Time",
    title: "Weekend Deals",
    highlight: "Up to 40% Off",
    description: "Flash prices on audio, wearables and accessories — this weekend only.",
    cta: { label: "Shop Deals", href: "/deals" },
    secondaryCta: { label: "View All", href: "/shop?sort=sale" },
    image: "https://picsum.photos/seed/hero-deals/1200/1000",
    theme: "dark",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="container-shell pt-4 sm:pt-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          slide.theme === "dark" ? "bg-foreground text-white" : "bg-surface text-foreground"
        )}
      >
        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div className="flex flex-col justify-center">
            <span className={cn("mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold", slide.theme === "dark" ? "bg-white/10 text-brand-soft" : "bg-brand-soft text-brand")}>
              {slide.eyebrow}
            </span>
            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              {slide.title} <span className="text-brand">{slide.highlight}</span>
            </h1>
            <p className={cn("mt-4 max-w-md text-sm sm:text-base", slide.theme === "dark" ? "text-white/70" : "text-muted")}>
              {slide.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={slide.cta.href}>
                <Button size="lg">{slide.cta.label}</Button>
              </Link>
              <Link href={slide.secondaryCta.href}>
                <Button size="lg" variant={slide.theme === "dark" ? "outline" : "outline"} className={slide.theme === "dark" ? "border-white/30 text-white hover:bg-white/10" : ""}>
                  {slide.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
            <Image src={slide.image} alt={slide.title} fill sizes="600px" className="object-cover" priority={index === 0} />
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md hover:bg-white sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md hover:bg-white sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-brand" : "w-1.5 bg-foreground/20")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
