import Link from "next/link";
import { AtSign, MessageCircle, Share2, Video, ShieldCheck, CreditCard } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME, SITE_TAGLINE, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/site";
import { Newsletter } from "./newsletter";
import { Logo } from "@/components/common/logo";

const columns = [
  { title: "Shop", links: FOOTER_LINKS.shop },
  { title: "Customer Service", links: FOOTER_LINKS.service },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Account", links: FOOTER_LINKS.account },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-foreground text-white">
      <div className="container-shell flex flex-col gap-8 border-b border-white/10 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">Get the Latest Tech & Deals</h3>
          <p className="text-sm text-white/60">Subscribe for exclusive drops and offers, straight to your inbox.</p>
        </div>
        <Newsletter variant="footer" />
      </div>

      <div className="container-shell grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2">
          <Logo tone="light" size="lg" />
          <p className="mt-2 text-sm text-white/50">{SITE_TAGLINE}</p>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Your trusted marketplace for phones, laptops, audio, gaming and smart home tech — shipped across Rwanda, the US, UK and UAE.
          </p>
          <div className="mt-4 space-y-1 text-sm text-white/60">
            <p>{SUPPORT_EMAIL}</p>
            <p>{SUPPORT_PHONE}</p>
          </div>
          <div className="mt-5 flex gap-3">
            {[Share2, AtSign, MessageCircle, Video].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">{col.title}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-shell flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure checkout</span>
          <span className="flex items-center gap-1.5"><CreditCard size={14} /> Visa · Mastercard · Mobile Money · PayPal</span>
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
