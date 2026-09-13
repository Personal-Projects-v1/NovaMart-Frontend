"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { CURRENCIES, REGIONS } from "@/constants/site";
import { usePreferencesStore } from "@/store/preferences.store";
import { toast } from "sonner";

export function RegionCurrencySelector() {
  const regionCode = usePreferencesStore((s) => s.regionCode);
  const currencyCode = usePreferencesStore((s) => s.currencyCode);
  const setRegion = usePreferencesStore((s) => s.setRegion);
  const setCurrency = usePreferencesStore((s) => s.setCurrency);
  const region = REGIONS.find((r) => r.code === regionCode)!;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-surface">
        <Globe size={14} />
        <span className="hidden sm:inline">{region.flag} {region.code}</span>
        <span className="text-muted">/ {currencyCode}</span>
        <ChevronDown size={12} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-56 rounded-xl border border-border bg-white p-2 shadow-xl">
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Region</p>
          {REGIONS.map((r) => (
            <DropdownMenu.Item
              key={r.code}
              onSelect={() => { setRegion(r.code); toast.success(`Region set to ${r.label}`); }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none hover:bg-surface"
            >
              <span>{r.flag}</span> {r.label}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Currency</p>
          {CURRENCIES.map((c) => (
            <DropdownMenu.Item
              key={c.code}
              onSelect={() => { setCurrency(c.code); toast.success(`Currency set to ${c.code}`); }}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm outline-none hover:bg-surface"
            >
              <span>{c.label}</span>
              <span className="text-muted">{c.symbol}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
