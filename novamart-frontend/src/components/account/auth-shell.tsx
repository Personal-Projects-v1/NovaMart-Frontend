import Image from "next/image";
import { BadgeCheck, Headphones, Truck } from "lucide-react";
import { Logo } from "@/components/common/logo";

const PERKS = [
  { icon: Truck, text: "Free delivery on orders over $200" },
  { icon: BadgeCheck, text: "100% authentic products, 2-year warranty" },
  { icon: Headphones, text: "Real human support, 7 days a week" },
];

/** Split-screen frame for sign-in, registration and verification screens. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="container-shell flex min-h-[72vh] items-center justify-center py-10 sm:py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-white shadow-lift lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative isolate hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
          <Image
            src="https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&h=1300&q=75"
            alt=""
            fill
            sizes="480px"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f1014]/80 via-[#0f1014]/55 to-[#0f1014]/90" />
          <Logo tone="light" />
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">Everything tech,<br />delivered with care.</h2>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur"><Icon size={16} /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="p-6 sm:p-10">
          <div className="mb-6 flex justify-center lg:hidden"><Logo size="lg" /></div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
