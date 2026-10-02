import Link from "next/link";
import { InfoPage } from "@/components/common/info-page";

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Refunds" intro="Changed your mind? Return most items within 30 days.">
      <p>We want you to love your purchase. If something isn&apos;t right, you can return most items within 30 days of delivery for a full refund or store credit.</p>
      <p><strong className="text-foreground">Eligibility:</strong> Items must be unused, in original packaging, with all accessories included.</p>
      <p><strong className="text-foreground">How to start a return:</strong> Sign in and go to <Link href="/account/orders" className="text-brand hover:underline">My Orders</Link>, select the delivered order, and click &ldquo;Request Return&rdquo;.</p>
      <p><strong className="text-foreground">Refund timing:</strong> Refunds are processed within 5-7 business days after we receive the returned item.</p>
    </InfoPage>
  );
}
