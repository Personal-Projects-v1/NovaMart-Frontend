import * as Icons from "lucide-react";
import { TRUST_BADGES } from "@/constants/site";

export function TrustStrip() {
  return (
    <section className="container-shell py-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl bg-surface p-6 sm:grid-cols-3 lg:grid-cols-6">
        {TRUST_BADGES.map((badge) => {
          const Icon = (Icons[badge.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.ShieldCheck;
          return (
            <div key={badge.title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground sm:text-sm">{badge.title}</p>
                <p className="hidden text-xs text-muted sm:block">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
