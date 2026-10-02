"use client";

import { useState } from "react";
import { Bell, Package, Tag, TrendingDown, Shield, PackageCheck } from "lucide-react";
import { Button } from "@/components/common/button";
import { EmptyState, SkeletonLine } from "@/components/common/states";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { deleteNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api/user.service";
import { errorMessage } from "@/services/api/client";
import { relativeTime, cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  order: Package,
  "price-drop": TrendingDown,
  promotion: Tag,
  stock: PackageCheck,
  security: Shield,
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useQuery({ queryKey: ["me", "notifications"], queryFn: listNotifications });
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  /** Applies a change to the cached list right away; the mutation rolls back on failure. */
  function optimistic(update: (list: AppNotification[]) => AppNotification[]) {
    const previous = queryClient.getQueryData<AppNotification[]>(["me", "notifications"]) ?? [];
    queryClient.setQueryData<AppNotification[]>(["me", "notifications"], (list = []) => update(list));
    return previous;
  }
  const rollback = (e: unknown, _v: unknown, previous: AppNotification[] | undefined) => {
    queryClient.setQueryData(["me", "notifications"], previous);
    toast.error(errorMessage(e));
  };

  const read = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: (id) => optimistic((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    onError: rollback,
  });
  const readAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: () => optimistic((l) => l.map((n) => ({ ...n, read: true }))),
    onError: rollback,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onMutate: (id) => optimistic((l) => l.filter((n) => n.id !== id)),
    onError: rollback,
  });

  const markRead = (id: string) => read.mutate(id);
  const markAllRead = () => readAll.mutate();

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

      {isLoading ? (
        <div className="flex flex-col gap-2">{[0, 1, 2].map((i) => <SkeletonLine key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <div key={n.id} onClick={() => !n.read && markRead(n.id)} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left", n.read ? "border-border" : "border-brand bg-brand-soft")}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand"><Icon size={16} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted">{n.body}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-muted">
                    {relativeTime(n.createdAt)}
                    {n.href && <Link href={n.href} onClick={(e) => e.stopPropagation()} className="font-semibold text-brand hover:underline">View</Link>}
                    <button onClick={(e) => { e.stopPropagation(); remove.mutate(n.id); }} className="hover:text-brand">Dismiss</button>
                  </p>
                </div>
                {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
