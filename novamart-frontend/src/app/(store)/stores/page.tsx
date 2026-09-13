"use client";

import { useState } from "react";
import { MapPin, Clock, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { stores } from "@/mocks/misc";

export default function StoresPage() {
  const [query, setQuery] = useState("");
  const filtered = stores.filter((s) => s.city.toLowerCase().includes(query.toLowerCase()) || s.country.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Store Locator" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Find a NovaMart Store</h1>
      <p className="mb-6 text-sm text-muted">Visit us in person for pickup, repairs and trade-ins.</p>

      <div className="mb-6 flex h-11 items-center gap-2 rounded-full border border-border bg-white px-4">
        <Search size={16} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by city or country..." className="flex-1 text-sm outline-none" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-3">
          {filtered.map((store) => (
            <div key={store.id} className="rounded-2xl border border-border bg-white p-4">
              <h3 className="font-bold">{store.name}</h3>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted"><MapPin size={14} className="mt-0.5 shrink-0" /> {store.address}, {store.city}, {store.country}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Clock size={14} /> {store.hours}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {store.services.map((s) => (
                  <span key={s} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-surface text-center text-sm text-muted">
          <div>
            <MapPin size={32} className="mx-auto mb-2 text-brand" />
            Interactive map view coming soon.
            <br />Use the list to find store details.
          </div>
        </div>
      </div>
    </div>
  );
}
