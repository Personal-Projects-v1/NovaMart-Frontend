import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=700&q=75`;

export function PromoBanner() {
  return (
    <section className="container-shell py-12">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="group relative isolate flex min-h-[260px] flex-col justify-center overflow-hidden rounded-3xl p-8 text-white sm:p-12">
          <Image src={photo("1761494296583-99b15e9063c5")} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand via-brand/85 to-brand/10" />
          <span className="mb-3 w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">Limited time</span>
          <h3 className="font-display text-2xl font-bold sm:text-4xl">Exclusive deals,<br />handpicked for you</h3>
          <p className="mt-3 max-w-sm text-sm text-white/90">Save on top-rated gadgets, from flash sales to everyday low prices.</p>
          <Link href="/deals" className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-foreground transition hover:bg-white/90">
            Shop deals <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="group relative isolate flex min-h-[260px] flex-col justify-center overflow-hidden rounded-3xl p-8 text-white sm:p-10">
          <Image src={photo("1511707171634-5f897ff02aa9")} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/85 to-[#0f1014]/30" />
          <h3 className="font-display text-xl font-bold sm:text-2xl">Trade in, save big</h3>
          <p className="mt-2 max-w-xs text-sm text-white/75">Get up to $300 credit toward your next NovaMart purchase when you trade in an old device.</p>
          <Link href="/support" className="mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold transition hover:bg-white/10">
            Learn more <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
