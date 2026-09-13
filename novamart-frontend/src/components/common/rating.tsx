import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  showCount = true,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  showCount?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-border"}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-muted">
          {value.toFixed(1)}
          {count !== undefined ? ` (${count.toLocaleString()})` : ""}
        </span>
      )}
    </div>
  );
}
