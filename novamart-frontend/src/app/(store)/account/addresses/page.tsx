"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { EmptyState, ErrorState, SkeletonLine } from "@/components/common/states";
import { MapPin } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddress, deleteAddress, listAddresses, setDefaultAddress, updateAddress } from "@/services/api/user.service";
import { errorMessage } from "@/services/api/client";
import type { Address } from "@/types";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading, isError, refetch } = useQuery({ queryKey: ["me", "addresses"], queryFn: listAddresses });
  // `editing.id` is empty while creating a new address
  const [editing, setEditing] = useState<Address | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["me", "addresses"] });
  const onError = (e: unknown) => toast.error(errorMessage(e));

  const save = useMutation({
    mutationFn: (a: Address) => (a.id ? updateAddress(a.id, a) : createAddress(a)),
    onSuccess: () => { void refresh(); toast.success("Address saved"); setModalOpen(false); },
    onError,
  });
  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => { void refresh(); toast.success("Address removed"); },
    onError,
  });
  const makeDefault = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => { void refresh(); toast.success("Default address updated"); },
    onError,
  });

  function startNew() {
    setEditing({ id: "", fullName: "", phone: "", country: "Rwanda", province: "", city: "", street: "", label: "Home" });
    setModalOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) save.mutate(editing);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Saved Addresses</h2>
        <Button size="sm" onClick={startNew}><Plus size={14} /> Add Address</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <SkeletonLine key={i} className="h-36 w-full" />)}</div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" description="Add an address to speed up checkout." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold">{addr.label ?? "Address"}</span>
                {addr.isDefault && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">Default</span>}
              </div>
              <p className="text-sm text-muted">{addr.fullName}<br />{addr.street}, {addr.city}<br />{addr.country}<br />{addr.phone}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setEditing(addr); setModalOpen(true); }} className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"><Pencil size={12} /> Edit</button>
                <button onClick={() => { if (window.confirm("Remove this address?")) remove.mutate(addr.id); }} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand"><Trash2 size={12} /> Delete</button>
                {!addr.isDefault && <button onClick={() => makeDefault.mutate(addr.id)} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-brand"><Star size={12} /> Set Default</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Address form">
        {editing && (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <h3 className="text-base font-bold sm:col-span-2">{editing.id ? "Edit Address" : "Add Address"}</h3>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Label</span><input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Full Name</span><input required value={editing.fullName} onChange={(e) => setEditing({ ...editing, fullName: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Phone</span><input required value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Country</span><input required value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Province/State</span><input required value={editing.province} onChange={(e) => setEditing({ ...editing, province: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">City</span><input required value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="input" /></label>
            <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Street Address</span><input required value={editing.street} onChange={(e) => setEditing({ ...editing, street: e.target.value })} className="input" /></label>
            <Button type="submit" className="sm:col-span-2" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save Address"}</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
