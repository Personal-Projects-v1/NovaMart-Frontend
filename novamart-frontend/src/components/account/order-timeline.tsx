import { Check } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { OrderTimelineEntry } from "@/types";

export function OrderTimeline({ timeline }: { timeline: OrderTimelineEntry[] }) {
  return (
    <ol className="flex flex-col">
      {timeline.map((entry, i) => (
        <li key={entry.status} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-white", entry.done ? "bg-success" : "bg-border text-muted")}>
              {entry.done && <Check size={12} />}
            </span>
            {i < timeline.length - 1 && <span className={cn("w-0.5 flex-1", entry.done ? "bg-success" : "bg-border")} style={{ minHeight: 24 }} />}
          </div>
          <div className="pb-6">
            <p className={cn("text-sm font-semibold", !entry.done && "text-muted")}>{entry.label}</p>
            {entry.done && entry.timestamp && <p className="text-xs text-muted">{formatDate(entry.timestamp)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
