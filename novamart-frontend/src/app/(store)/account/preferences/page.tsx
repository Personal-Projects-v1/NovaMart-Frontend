"use client";

import { toast } from "sonner";
import { CURRENCIES, REGIONS } from "@/constants/site";
import { usePreferencesStore } from "@/store/preferences.store";
import { useState } from "react";

export default function PreferencesPage() {
  const region = usePreferencesStore((s) => s.regionCode);
  const currency = usePreferencesStore((s) => s.currencyCode);
  const setRegion = usePreferencesStore((s) => s.setRegion);
  const setCurrency = usePreferencesStore((s) => s.setCurrency);
  const [communication, setCommunication] = useState({ orderUpdates: true, promotions: true, priceDrops: true, newsletter: false });
  const [theme, setTheme] = useState<"light" | "system">("light");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Regional Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Region</span>
            <select value={region} onChange={(e) => { setRegion(e.target.value as typeof region); toast.success("Region updated"); }} className="input">
              {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.flag} {r.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Currency</span>
            <select value={currency} onChange={(e) => { setCurrency(e.target.value as typeof currency); toast.success("Currency updated"); }} className="input">
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Communication Preferences</h2>
        <div className="flex flex-col gap-3">
          {Object.entries({
            orderUpdates: "Order updates",
            promotions: "Promotions & deals",
            priceDrops: "Price drop alerts",
            newsletter: "Weekly newsletter",
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              {label}
              <input
                type="checkbox"
                checked={communication[key as keyof typeof communication]}
                onChange={(e) => setCommunication((c) => ({ ...c, [key]: e.target.checked }))}
                className="accent-brand"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Appearance</h2>
        <div className="flex gap-2">
          {(["light", "system"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${theme === t ? "bg-foreground text-white" : "bg-surface"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
