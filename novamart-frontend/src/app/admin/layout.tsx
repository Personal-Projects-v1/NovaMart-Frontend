import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Bell, Search } from "lucide-react";
import { RequireAuth } from "@/components/common/require-auth";
import { AdminUserBadge } from "@/components/admin/admin-user-badge";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="admin">
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-5">
          <div className="flex h-9 w-72 max-w-full items-center gap-2 rounded-full bg-surface px-3">
            <Search size={14} className="text-muted" />
            <input placeholder="Search admin..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface"><Bell size={18} /></button>
            <AdminUserBadge />
          </div>
        </header>
        <main className="p-5">{children}</main>
      </div>
    </div>
    </RequireAuth>
  );
}
