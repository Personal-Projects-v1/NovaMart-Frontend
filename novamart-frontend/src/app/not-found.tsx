import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/common/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        <SearchX size={36} />
      </span>
      <h1 className="mt-6 text-4xl font-extrabold">404</h1>
      <p className="mt-2 text-lg font-semibold">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/"><Button>Back to Home</Button></Link>
        <Link href="/shop"><Button variant="outline">Browse Shop</Button></Link>
      </div>
    </div>
  );
}
