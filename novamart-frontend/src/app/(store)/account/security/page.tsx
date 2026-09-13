"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Smartphone, Monitor, LogOut } from "lucide-react";
import { Button } from "@/components/common/button";

const SESSIONS = [
  { id: "s1", device: "Chrome on Windows", location: "Kigali, Rwanda", current: true, icon: Monitor },
  { id: "s2", device: "NovaMalt App on iPhone", location: "Kigali, Rwanda", current: false, icon: Smartphone },
];

export default function SecurityPage() {
  const [twoFactor, setTwoFactor] = useState(false);

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Password changed successfully");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Change Password</h2>
        <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Current Password</span><input type="password" required className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">New Password</span><input type="password" required className="input" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Confirm New Password</span><input type="password" required className="input" /></label>
          <Button type="submit" className="sm:col-span-2 sm:self-start">Update Password</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-brand" />
            <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
          </div>
          <button
            onClick={() => { setTwoFactor((v) => !v); toast.success(twoFactor ? "2FA disabled" : "2FA enabled"); }}
            className={`h-6 w-11 rounded-full transition ${twoFactor ? "bg-brand" : "bg-surface-strong"}`}
          >
            <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform ${twoFactor ? "translate-x-5" : ""}`} />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">Add an extra layer of security to your account with an authenticator app.</p>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-4 text-lg font-bold">Active Sessions</h2>
        <div className="flex flex-col gap-3">
          {SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="flex items-center gap-3">
                <s.icon size={18} className="text-muted" />
                <div>
                  <p className="text-sm font-medium">{s.device} {s.current && <span className="text-xs text-success">(This device)</span>}</p>
                  <p className="text-xs text-muted">{s.location}</p>
                </div>
              </div>
              {!s.current && (
                <button onClick={() => toast.success("Session signed out")} className="text-xs font-semibold text-brand hover:underline">Sign out</button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => toast.success("Signed out of all devices")}>
          <LogOut size={14} /> Log Out of All Devices
        </Button>
      </div>
    </div>
  );
}
