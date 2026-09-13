import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductListing } from "@/components/product/product-listing";
import { TRENDING_SEARCHES } from "@/store/search-history.store";
import Link from "next/link";

function didYouMean(query: string): string | null {
  const known = ["iphone", "laptop", "earbuds", "watch", "camera", "monitor", "keyboard", "mouse", "speaker", "drone"];
  const q = query.toLowerCase();
  for (const word of known) {
    if (q.length > 2 && (word.startsWith(q.slice(0, 3)) || q.startsWith(word.slice(0, 3))) && word !== q) {
      return word;
    }
  }
  return null;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const suggestion = q ? didYouMean(q) : null;

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {q ? `Search results for "${q}"` : "Search"}
      </h1>
      {suggestion && (
        <p className="mb-4 text-sm text-muted">
          Did you mean{" "}
          <Link href={`/search?q=${suggestion}`} className="font-semibold text-brand hover:underline">
            {suggestion}
          </Link>
          ?
        </p>
      )}

      {q ? (
        <div className="mt-4">
          <ProductListing initialQuery={q} />
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((term) => (
            <Link key={term} href={`/search?q=${term}`} className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand">
              {term}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
