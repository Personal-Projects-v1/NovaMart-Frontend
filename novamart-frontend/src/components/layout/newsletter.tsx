"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/button";

export function Newsletter({ variant = "default" }: { variant?: "default" | "footer" }) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed! Watch your inbox for deals.");
    setEmail("");
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-10 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-brand"
        />
        <Button type="submit" size="sm" className="shrink-0">
          <Send size={14} />
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-surface p-8 sm:flex-row sm:p-10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
          <Mail size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Get the Latest Tech & Deals</h3>
          <p className="text-sm text-muted">Join our newsletter and never miss an update.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-11 flex-1 rounded-full border border-border bg-white px-4 text-sm outline-none focus:border-brand"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  );
}
