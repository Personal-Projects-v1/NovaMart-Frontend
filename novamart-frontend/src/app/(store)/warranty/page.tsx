import { InfoPage } from "@/components/common/info-page";

export default function WarrantyPage() {
  return (
    <InfoPage title="Warranty Information">
      <p>All products sold on NovaMart include a manufacturer warranty of at least 12 months, with many devices covered for up to 24 months.</p>
      <p><strong className="text-foreground">What&apos;s covered:</strong> Defects in materials and workmanship under normal use.</p>
      <p><strong className="text-foreground">What&apos;s not covered:</strong> Accidental damage, unauthorized repairs, water damage, and normal wear and tear.</p>
      <p>To make a warranty claim, contact our support team with your order number and a description of the issue.</p>
    </InfoPage>
  );
}
