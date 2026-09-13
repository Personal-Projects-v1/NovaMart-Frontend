"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchSuggestions } from "@/services/api/product.service";
import { useSearchHistoryStore, TRENDING_SEARCHES } from "@/store/search-history.store";
import { cn } from "@/lib/utils";

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const recent = useSearchHistoryStore((s) => s.recent);
  const addRecent = useSearchHistoryStore((s) => s.add);
  const clearRecent = useSearchHistoryStore((s) => s.clear);

  const { data } = useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: () => searchSuggestions(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestionItems = query
    ? (data?.products.map((p) => p.name) ?? [])
    : [...recent, ...TRENDING_SEARCHES.slice(0, 4 - Math.min(recent.length, 4))];

  function submitSearch(term: string) {
    if (!term.trim()) return;
    addRecent(term);
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex h-11 items-center rounded-full border border-border bg-surface pl-4 pr-1.5 focus-within:border-brand focus-within:bg-white transition-colors">
        <Search size={18} className="shrink-0 text-muted" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (activeIndex >= 0 && suggestionItems[activeIndex]) submitSearch(suggestionItems[activeIndex]);
              else submitSearch(query);
            }
            if (e.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, suggestionItems.length - 1));
            if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, -1));
            if (e.key === "Escape") setOpen(false);
          }}
          type="search"
          placeholder="Search for phones, laptops, audio & more..."
          className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted"
          aria-label="Search products"
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")} className="mr-1 flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-strong">
            <X size={14} />
          </button>
        )}
        <button
          onClick={() => submitSearch(query)}
          className="flex h-8 items-center rounded-full bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark"
        >
          Search
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-white p-3 shadow-xl">
          {!query && (
            <>
              {recent.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1.5 flex items-center justify-between px-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">Recent searches</span>
                    <button onClick={clearRecent} className="text-xs text-brand hover:underline">Clear</button>
                  </div>
                  {recent.map((term, i) => (
                    <button
                      key={term}
                      onClick={() => submitSearch(term)}
                      className={cn("flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-surface", activeIndex === i && "bg-surface")}
                    >
                      <Clock size={14} className="text-muted" /> {term}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <span className="mb-1.5 block px-1 text-xs font-semibold uppercase tracking-wide text-muted">Trending searches</span>
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => submitSearch(term)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-surface"
                  >
                    <TrendingUp size={14} className="text-brand" /> {term}
                  </button>
                ))}
              </div>
            </>
          )}

          {query && (
            <>
              {data?.categories && data.categories.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2 px-1">
                  {data.categories.map((c) => (
                    <Link key={c} href={`/search?q=${c}`} onClick={() => setOpen(false)} className="rounded-full bg-surface px-3 py-1 text-xs font-medium hover:bg-surface-strong">
                      in {c}
                    </Link>
                  ))}
                </div>
              )}
              {data?.products.length ? (
                data.products.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => { addRecent(p.name); setOpen(false); }}
                    className={cn("flex items-center gap-3 rounded-lg p-2 hover:bg-surface", activeIndex === i && "bg-surface")}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-strong">
                      <Image src={p.thumbnail} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{p.brand.name} · ${p.price}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="px-2 py-4 text-center text-sm text-muted">No matches for &ldquo;{query}&rdquo; yet — press Enter to search anyway.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
