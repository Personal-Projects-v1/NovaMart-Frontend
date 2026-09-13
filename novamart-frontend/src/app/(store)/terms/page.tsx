import { InfoPage } from "@/components/common/info-page";

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service">
      <p>By using NovaMalt, you agree to these terms. Please read them carefully.</p>
      <p><strong className="text-foreground">Orders:</strong> All orders are subject to product availability and confirmation of payment.</p>
      <p><strong className="text-foreground">Pricing:</strong> Prices are listed in USD and may vary by region and currency conversion.</p>
      <p><strong className="text-foreground">Account responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
      <p>This is a demonstration terms page for the NovaMalt storefront prototype and does not reflect a live legal document.</p>
    </InfoPage>
  );
}
