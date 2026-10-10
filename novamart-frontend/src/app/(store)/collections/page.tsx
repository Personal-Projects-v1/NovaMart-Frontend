import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CollectionCards } from "@/components/home/collection-cards";

// TEMPORARY: Disabled API integration until backend is deployed
// export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  const collections: any[] = [];
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Shop by Collection</h1>
      <p className="mb-2 text-sm text-muted">Curated bundles for every lifestyle and use case.</p>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <CollectionCards collections={collections} />
      </div>
    </div>
  );
}
