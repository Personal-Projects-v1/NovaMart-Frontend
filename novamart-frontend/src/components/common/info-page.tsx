"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils";

const TOPICS = [
  { href: "/about", label: "About NovaMart" },
  { href: "/shipping", label: "Shipping info" },
  { href: "/returns", label: "Returns & refunds" },
  { href: "/warranty", label: "Warranty" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

const BANNER = "https://images.unsplash.com/photo-1777073232732-8d66f9405a8d?auto=format&fit=crop&w=1600&h=500&q=70";

/** Shared frame for content pages: photo banner, topic navigation and a readable article column. */
export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: title }]} />

      <div className="relative isolate mt-4 overflow-hidden rounded-3xl p-8 text-white sm:p-12">
        <Image src={BANNER} alt="" fill priority sizes="1336px" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/80 to-[#0f1014]/40" />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">{intro}</p>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Help topics" className="h-fit rounded-2xl border border-border bg-white p-2 lg:sticky lg:top-28">
          {TOPICS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "block rounded-xl px-3 py-2.5 text-sm font-medium transition",
                pathname === t.href ? "bg-brand-soft text-brand" : "text-foreground/80 hover:bg-surface"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <article
          className={cn(
            "max-w-3xl rounded-2xl border border-border bg-white p-6 text-[15px] leading-7 text-muted sm:p-8",
            "[&_p]:mb-4 [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground first:[&_h2]:mt-0",
            "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-brand [&_strong]:text-foreground"
          )}
        >
          {children}
        </article>
      </div>
    </div>
  );
}
