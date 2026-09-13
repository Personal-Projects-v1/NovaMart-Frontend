import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/components/common/button";

export function PromoBanner() {
  return (
    <section className="container-shell py-10">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col justify-center gap-3 rounded-3xl bg-brand p-8 text-white sm:p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Gift size={20} /></span>
          <h3 className="text-2xl font-bold">Exclusive Deals for You</h3>
          <p className="max-w-sm text-sm text-white/85">Save more on top-rated gadgets, handpicked based on what you love.</p>
          <Link href="/deals" className="mt-2 w-fit">
            <Button size="lg" variant="secondary">Shop Deals →</Button>
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-2 rounded-3xl bg-foreground p-8 text-white sm:p-10">
          <h3 className="text-xl font-bold">Trade in, save big</h3>
          <p className="text-sm text-white/70">Trade in your old device and get up to $300 credit toward your next NovaMart purchase.</p>
          <Link href="/support" className="mt-2 w-fit">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
