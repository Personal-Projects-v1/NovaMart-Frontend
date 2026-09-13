"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Button } from "@/components/common/button";
import { mockUser } from "@/mocks/misc";

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone ?? "",
    birthday: "",
    gender: "",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profile updated successfully");
  }

  return (
    <div className="rounded-2xl border border-border p-5 sm:p-7">
      <h2 className="mb-6 text-lg font-bold">Personal Information</h2>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand">
          {form.firstName.charAt(0)}
          <button type="button" onClick={() => toast.info("Avatar upload is not available in this demo")} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-white">
            <Camera size={12} />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-muted">{form.email}</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">First Name</span><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Last Name</span><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Phone</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></label>
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
        <Button type="submit" className="sm:col-span-2 sm:self-start">Save Changes</Button>
      </form>
    </div>
  );
}
