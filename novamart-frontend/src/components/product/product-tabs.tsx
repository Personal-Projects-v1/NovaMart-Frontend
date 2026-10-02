"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { ReviewSection } from "./review-section";
import { QASection } from "./qa-section";
import type { Product, ProductQuestion, Review } from "@/types";

export function ProductTabs({ product, reviews, questions }: { product: Product; reviews: Review[]; questions: ProductQuestion[] }) {
  const tabs = [
    { value: "description", label: "Description" },
    { value: "specifications", label: "Specifications" },
    { value: "reviews", label: `Reviews (${reviews.length})` },
    { value: "qa", label: `Q&A (${questions.length})` },
    { value: "warranty", label: "Warranty" },
    { value: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <Tabs.Root defaultValue="description" className="mt-14">
      <Tabs.List className="flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-muted transition data-[state=active]:border-brand data-[state=active]:text-brand"
            )}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="description" className="py-6 text-sm leading-relaxed text-muted">
        <p>{product.description}</p>
      </Tabs.Content>

      <Tabs.Content value="specifications" className="py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {product.specGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-sm font-bold">{group.title}</h3>
              <dl className="divide-y divide-border rounded-xl border border-border">
                {group.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 px-3 py-2 text-sm">
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className="text-right font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="py-6">
        <ReviewSection reviews={reviews} productId={product.id} />
      </Tabs.Content>

      <Tabs.Content value="qa" className="py-6">
        <QASection questions={questions} productId={product.id} />
      </Tabs.Content>

      <Tabs.Content value="warranty" className="py-6 text-sm leading-relaxed text-muted">
        <p>
          This product includes a {product.warrantyMonths}-month manufacturer warranty covering defects in materials and
          workmanship. Extended warranty plans are available at checkout. Warranty does not cover accidental damage,
          unauthorized repairs, or normal wear and tear.
        </p>
      </Tabs.Content>

      <Tabs.Content value="shipping" className="py-6 text-sm leading-relaxed text-muted">
        <p className="mb-2">
          Orders are processed within 1-2 business days. Standard shipping takes 5-7 business days; express shipping
          takes 2-3 business days. Free standard shipping applies to orders over $200.
        </p>
        <p>
          Returns are accepted within 30 days of delivery, provided the item is unused and in its original packaging.
          Visit our <a href="/returns" className="text-brand hover:underline">Returns page</a> to start a request.
        </p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
