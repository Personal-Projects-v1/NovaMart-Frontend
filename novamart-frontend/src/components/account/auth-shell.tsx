import Link from "next/link";
import * as Icons from "lucide-react";
import { SITE_NAME } from "@/constants/site";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="container-shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"><Icons.Zap size={18} fill="white" /></span>
          <span className="font-display text-xl font-extrabold">{SITE_NAME}</span>
        </Link>
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
