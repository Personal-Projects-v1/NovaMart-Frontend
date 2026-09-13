import { InfoPage } from "@/components/common/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>NovaMart respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.</p>
      <p><strong className="text-foreground">Information we collect:</strong> Account details, order history, shipping addresses, and browsing preferences to improve your experience.</p>
      <p><strong className="text-foreground">How we use it:</strong> To process orders, provide support, personalize recommendations, and send updates you&apos;ve opted into.</p>
      <p><strong className="text-foreground">Your choices:</strong> You can update your communication preferences or request account deletion at any time from your account settings.</p>
      <p>This is a demonstration policy for the NovaMart storefront prototype and does not reflect a live legal document.</p>
    </InfoPage>
  );
}
