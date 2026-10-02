"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, Smartphone, Monitor, LogOut } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { SkeletonLine } from "@/components/common/states";
import { useAuthStore } from "@/store/auth.store";
import { changePassword, listSessions, revokeSession } from "@/services/api/user.service";
import { logoutAll } from "@/services/api/auth.service";
import { errorMessage } from "@/services/api/client";
import { passwordStrength } from "@/schemas/auth.schema";
import { formatDate } from "@/lib/utils";

export default function SecurityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentSessionId = useAuthStore((s) => s.sessionId);
  const logout = useAuthStore((s) => s.logout);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });

  const sessions = useQuery({ queryKey: ["me", "sessions"], queryFn: listSessions });

  const change = useMutation({
    mutationFn: () => changePassword(form.current, form.next),
    onSuccess: () => {
      setForm({ current: "", next: "", confirm: "" });
      toast.success("Password changed successfully");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const revoke = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["me", "sessions"] }); toast.success("Session signed out"); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const revokeAll = useMutation({
    mutationFn: logoutAll,
    onSuccess: () => {
      logout();
      toast.success("Signed out of all devices");
      router.push("/login");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      toast.error("The new passwords don't match.");
      return;
    }
    if (passwordStrength(form.next) < 3 || !/[a-z]/.test(form.next) || !/[A-Z]/.test(form.next) || !/\d/.test(form.next)) {
      toast.error("Use 8+ characters with an uppercase letter, a lowercase letter and a number.");
      return;
    }
    change.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Change Password</h2>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Current Password</span><input type="password" required autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">New Password</span><input type="password" required autoComplete="new-password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Confirm New Password</span><input type="password" required autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input" /></label>
          <Button type="submit" className="sm:col-span-2 sm:self-start" disabled={change.isPending}>{change.isPending ? "Updating..." : "Update Password"}</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-brand" />
            <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
          </div>
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">Coming soon</span>
        </div>
        <p className="mt-2 text-sm text-muted">Add an extra layer of security to your account with an authenticator app. This isn&apos;t available yet.</p>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Active Sessions</h2>
        <div className="flex flex-col gap-3">
          {sessions.isLoading && [0, 1].map((i) => <SkeletonLine key={i} className="h-14 w-full" />)}
          {sessions.data?.map((s) => {
            const current = s.id === currentSessionId;
            const Icon = /iOS|Android/.test(s.device) ? Smartphone : Monitor;
            return (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-muted" />
                  <div>
                    <p className="text-sm font-medium">{s.device} {current && <span className="text-xs text-success">(This device)</span>}</p>
                    <p className="text-xs text-muted">Signed in {formatDate(s.createdAt)}{s.ipAddress ? ` · ${s.ipAddress}` : ""}</p>
                  </div>
                </div>
                {!current && (
                  <button onClick={() => revoke.mutate(s.id)} disabled={revoke.isPending} className="text-xs font-semibold text-brand hover:underline">Sign out</button>
                )}
              </div>
            );
          })}
        </div>
        <Button variant="outline" className="mt-4" disabled={revokeAll.isPending} onClick={() => revokeAll.mutate()}>
          <LogOut size={14} /> Log Out of All Devices
        </Button>
      </div>
    </div>
  );
}
