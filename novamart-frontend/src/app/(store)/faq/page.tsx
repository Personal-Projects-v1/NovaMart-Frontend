import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const FAQS = [
  { q: "Is NovaMart an authorized retailer?", a: "Yes, we source directly from authorized distributors and certified vendors for every brand we carry." },
  { q: "Can I change my order after placing it?", a: "You can cancel an order while it's in Processing status. For other changes, please contact support as soon as possible." },
  { q: "Do you offer installment payments?", a: "Yes, eligible products display installment pricing on the product page and at checkout." },
  { q: "How do I contact customer support?", a: "Visit our Contact page or Support Center to reach our team via form, email or phone." },
];

export default function FaqPage() {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Frequently Asked Questions</h1>
      <Accordion.Root type="single" collapsible className="flex max-w-2xl flex-col gap-2">
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
  );
}
