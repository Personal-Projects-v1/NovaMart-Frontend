import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Package, CreditCard, RotateCcw, Truck, User, Smartphone, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const TOPICS = [
  { icon: Package, label: "Order Help" },
  { icon: CreditCard, label: "Payments" },
  { icon: RotateCcw, label: "Returns" },
  { icon: Truck, label: "Shipping" },
  { icon: User, label: "Accounts" },
  { icon: Smartphone, label: "Products" },
  { icon: Shield, label: "Warranty" },
];

const FAQS = [
  { q: "How do I track my order?", a: "Visit the Track Order page and enter your order number along with the email or phone used at checkout, or check My Orders if you're signed in." },
  { q: "What is your return policy?", a: "We accept returns within 30 days of delivery provided the item is unused and in its original packaging. Start a return from your order details page." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Store pickup is available at select locations." },
  { q: "Do you ship internationally?", a: "Yes, we currently ship to Rwanda, the United States, the United Kingdom and the UAE, with more regions coming soon." },
  { q: "How do I cancel an order?", a: "Orders can be cancelled while they're still in 'Processing' status from the order detail page. Once shipped, please request a return instead." },
  { q: "What payment methods do you accept?", a: "We accept major credit and debit cards, mobile money, PayPal, and bank transfer." },
];

export default function SupportPage() {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Support" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Support Center</h1>
      <p className="mb-8 text-sm text-muted">How can we help you today?</p>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {TOPICS.map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand"><t.icon size={18} /></span>
            <span className="text-xs font-semibold">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-4 text-lg font-bold">Frequently Asked Questions</h2>
          <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <Accordion.Item key={i} value={`item-${i}`} className="rounded-xl border border-border">
                <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold [&[data-state=open]>svg]:rotate-180">
                  {faq.q} <ChevronDown size={16} className="shrink-0 transition-transform" />
                </Accordion.Trigger>
                <Accordion.Content className="px-4 pb-4 text-sm text-muted">{faq.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
        <aside className="h-fit rounded-2xl bg-surface p-5">
          <h3 className="mb-2 text-sm font-bold">Still need help?</h3>
          <p className="mb-4 text-sm text-muted">Our support team is available 24/7 to help with any questions.</p>
          <Link href="/contact" className="block rounded-full bg-brand py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark">Contact Us</Link>
        </aside>
      </div>
    </div>
  );
}
