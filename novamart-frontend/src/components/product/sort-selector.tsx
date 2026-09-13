"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "@/constants/filters";

export function SortSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium outline-none focus:border-brand">
        <span className="text-muted">Sort:</span>
        <Select.Value />
        <Select.Icon><ChevronDown size={14} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 overflow-hidden rounded-xl border border-border bg-white shadow-xl" position="popper" sideOffset={6}>
          <Select.Viewport className="p-1">
            {SORT_OPTIONS.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator><Check size={14} className="text-brand" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
