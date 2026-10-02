"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BadgeCheck, Camera } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/common/button";
import { useAuthStore } from "@/store/auth.store";
import { updateProfile } from "@/services/api/user.service";
import { errorMessage } from "@/services/api/client";
import { normalizePhone } from "@/services/api/auth.service";
import type { User } from "@/types";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  // keyed by id so the form starts from the signed-in profile (and resets if the account changes)
  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? "",
    birthday: user.birthday ?? "",
    gender: user.gender ?? "",
  });

  const save = useMutation({
    mutationFn: () =>
      updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone ? normalizePhone(form.phone) : "",
        birthday: form.birthday || null,
        gender: form.gender || null,
      }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success("Profile updated successfully");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="rounded-2xl border border-border p-5 sm:p-7">
      <h2 className="mb-6 text-lg font-bold">Personal Information</h2>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand">
          {user.firstName.charAt(0)}
          <button type="button" onClick={() => toast.info("Avatar upload is not available yet")} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-white">
            <Camera size={12} />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
          <p className="flex items-center gap-1 text-xs text-muted">
            {user.email}
            {user.emailVerified ? (
              <span className="flex items-center gap-0.5 text-success"><BadgeCheck size={12} /> Verified</span>
            ) : (
              <Link href="/verify-email" className="font-semibold text-brand hover:underline">Verify email</Link>
            )}
          </p>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">First Name</span><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Last Name</span><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Email</span>
          <input type="email" value={user.email} readOnly disabled className="input opacity-70" title="Your email is your sign-in and can't be changed here" />
        </label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Phone</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+250 788 123 456" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Birthday (optional)</span><input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold">Gender (optional)</span>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input">
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Button type="submit" className="sm:col-span-2 sm:self-start" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save Changes"}</Button>
      </form>
    </div>
  );
}
