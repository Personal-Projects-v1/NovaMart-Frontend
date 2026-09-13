"use client";

import { useState } from "react";
import { Bell, Package, Tag, TrendingDown, Shield, PackageCheck } from "lucide-react";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/states";
import { notifications as initialNotifications } from "@/mocks/misc";
import { relativeTime, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  order: Package,
  "price-drop": TrendingDown,
  promotion: Tag,
  stock: PackageCheck,
  security: Shield,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filters: { value: NotificationType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "order", label: "Orders" },
    { value: "price-drop", label: "Price Drops" },
    { value: "promotion", label: "Promotions" },
    { value: "stock", label: "Stock" },
    { value: "security", label: "Security" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Notifications ({notifications.filter((n) => !n.read).length} unread)</h2>
        <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium", filter === f.value ? "bg-foreground text-white" : "bg-surface")}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <button key={n.id} onClick={() => markRead(n.id)} className={cn("flex items-start gap-3 rounded-xl border p-3 text-left", n.read ? "border-border" : "border-brand bg-brand-soft")}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand"><Icon size={16} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted">{n.body}</p>
                  <p className="mt-1 text-xs text-muted">{relativeTime(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
