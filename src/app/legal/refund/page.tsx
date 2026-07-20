import { LegalPage } from "@/components/legal/LegalPage";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="July 2026"
      sections={[
        { heading: "Standard Catalog Items", body: "Unused, undamaged catalog items can be returned within 7 days of delivery for a full refund." },
        { heading: "Custom & Personalized Orders", body: "Because these are produced specifically for you, custom orders, engravings, and uploaded-file prints are final sale unless the item arrives defective." },
        { heading: "Damaged or Defective Items", body: "If your order arrives damaged, contact us within 48 hours with photos and we'll arrange a reprint or refund." },
        { heading: "Refund Timing", body: "Approved refunds are processed to your original payment method within 5-7 business days." },
      ]}
    />
  );
}
