"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  /** visual tone of the text panel */
  tone: "dark" | "light" | "warm";
  stats?: { value: string; label: string }[];
}

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&h=1000&q=80`;

const SLIDES: Slide[] = [
  {
    id: "latest-tech",
    eyebrow: "New season · Free delivery over $200",
    title: "Premium tech,",
    highlight: "delivered to your door",
    description: "Phones, laptops, audio and smart home gear from the brands you trust, backed by a 2-year warranty.",
    cta: { label: "Shop all products", href: "/shop" },
    secondaryCta: { label: "Today's deals", href: "/deals" },
    image: photo("1496181133206-80ce9b88a853"),
    tone: "light",
    stats: [{ value: "29+", label: "Top products" }, { value: "4.7★", label: "Avg. rating" }, { value: "30-day", label: "Easy returns" }],
  },
  {
    id: "gaming-setup",
    eyebrow: "Level up",
    title: "Build your ultimate",
    highlight: "gaming setup",
    description: "Ultra-wide monitors, mechanical keyboards and performance laptops built for competitive play.",
    cta: { label: "Shop all products", href: "/shop" },
    secondaryCta: { label: "Today's deals", href: "/deals" },
    image: photo("1496181133206-80ce9b88a853"),
    tone: "dark",
  },
  {
    id: "phones",
    eyebrow: "Just launched",
    title: "Meet the",
    highlight: "Aurora Pro 15",
    description: "Titanium build, a pro-grade camera system and all-day battery life. Available now.",
    cta: { label: "Shop all products", href: "/shop" },
    secondaryCta: { label: "Today's deals", href: "/deals" },
    image: photo("1496181133206-80ce9b88a853"),
    tone: "dark",
  },
  {
    id: "audio",
    eyebrow: "Sound, perfected",
    title: "Hear every",
    highlight: "detail",
    description: "Noise-cancelling headphones and true-wireless earbuds with studio-grade sound.",
    cta: { label: "Shop all products", href: "/shop" },
    secondaryCta: { label: "Today's deals", href: "/deals" },
    image: photo("1496181133206-80ce9b88a853"),
    tone: "warm",
  },
];

const TONES = {
  dark: { panel: "bg-[#0f1014] text-white", fade: "from-[#0f1014]", muted: "text-white/70", chip: "bg-white/10 text-white", ghost: "border-white/25 text-white hover:bg-white/10" },
  light: { panel: "bg-[#f4f5f7] text-foreground", fade: "from-[#f4f5f7]", muted: "text-muted", chip: "bg-white text-brand shadow-sm", ghost: "border-foreground/15 text-foreground hover:bg-white" },
  warm: { panel: "bg-[#fff6d5] text-foreground", fade: "from-[#fff6d5]", muted: "text-foreground/70", chip: "bg-white text-brand shadow-sm", ghost: "border-foreground/15 text-foreground hover:bg-white/70" },
} as const;

const INTERVAL = 6500;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, go]);

  return (
    <section
      className="container-shell pt-4 sm:pt-6"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-lift">
        {SLIDES.map((slide, i) => {
          const tone = TONES[slide.tone];
          const active = i === index;
          return (
            <div
              key={slide.id}
              aria-hidden={!active}
              className={cn(
                "grid transition-opacity duration-700 lg:grid-cols-[1fr_1.05fr]",
                tone.panel,
                active ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
              )}
            >
              {/* photo: on top for phones, right-hand side on desktop, fading into the text panel */}
              <div className="relative order-first h-52 overflow-hidden sm:h-72 lg:order-last lg:h-auto lg:min-h-[480px]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={cn("object-cover transition-transform duration-[6500ms] ease-out", active && "scale-105")}
                />
                <div className={cn("absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r to-transparent lg:block", tone.fade)} />
                <div className={cn("absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent lg:hidden", tone.fade)} />
              </div>

              <div className="relative z-10 flex flex-col justify-center gap-5 p-6 pb-14 sm:p-10 sm:pb-16 lg:p-14 lg:pr-6">
                <span className={cn("inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-semibold", tone.chip, active && "animate-fade-up")}>
                  {slide.eyebrow}
                </span>
                <h1 className={cn("font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.4rem]", active && "animate-fade-up [animation-delay:80ms]")}>
                  {slide.title} <span className="text-brand">{slide.highlight}</span>
                </h1>
                <p className={cn("max-w-md text-sm sm:text-base", tone.muted, active && "animate-fade-up [animation-delay:160ms]")}>{slide.description}</p>
                <div className={cn("flex flex-wrap items-center gap-3", active && "animate-fade-up [animation-delay:240ms]")}>
                  <Link
                    href={slide.cta.href}
                    tabIndex={active ? 0 : -1}
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
                  >
                    {slide.cta.label} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={slide.secondaryCta.href}
                    tabIndex={active ? 0 : -1}
                    className={cn("inline-flex h-12 items-center rounded-full border px-6 text-sm font-semibold transition", tone.ghost)}
                  >
                    {slide.secondaryCta.label}
                  </Link>
                </div>
                {slide.stats && (
                  <dl className="mt-2 hidden gap-8 border-t border-foreground/10 pt-5 sm:flex">
                    {slide.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="sr-only">{s.label}</dt>
                        <dd className="text-xl font-bold">{s.value}</dd>
                        <p className={cn("text-xs", tone.muted)}>{s.label}</p>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        {/* progress pills */}
        <div className="absolute bottom-5 left-6 z-20 flex gap-2 sm:left-10 lg:left-14">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="relative h-1.5 w-10 overflow-hidden rounded-full bg-foreground/20"
            >
              <span
                className={cn("absolute inset-y-0 left-0 rounded-full bg-brand", i < index && "w-full", i > index && "w-0")}
                style={i === index ? { animation: `hero-progress ${INTERVAL}ms linear forwards`, animationPlayState: paused ? "paused" : "running" } : undefined}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
