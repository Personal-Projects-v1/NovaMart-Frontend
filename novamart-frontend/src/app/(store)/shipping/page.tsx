import { InfoPage } from "@/components/common/info-page";

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping Information">
      <p>We offer standard and express shipping to Rwanda, the United States, the United Kingdom and the UAE.</p>
      <p><strong className="text-foreground">Standard Shipping:</strong> 5-7 business days. Free on orders over $200, otherwise $9.99.</p>
      <p><strong className="text-foreground">Express Shipping:</strong> 2-3 business days for $19.99.</p>
      <p><strong className="text-foreground">Store Pickup:</strong> Available at select NovaMalt locations, typically ready within 24 hours.</p>
      <p>You&apos;ll receive a tracking number by email once your order ships. Delivery times may vary based on your location and local customs processing.</p>
    </InfoPage>
  );
}
