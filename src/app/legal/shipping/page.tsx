import { LegalPage } from "@/components/legal/LegalPage";

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated="July 2026"
      sections={[
        { heading: "Processing Time", body: "In-stock items ship within 48 hours. Made-to-order and custom items ship after production completes, shown as an estimate on each product page." },
        { heading: "Shipping Rates", body: "Orders over ₹999 ship free. Orders below that threshold have a flat ₹99 shipping fee, calculated at checkout." },
        { heading: "Delivery Estimates", body: "Domestic delivery typically takes 3-5 business days after shipping; international delivery varies by destination." },
        { heading: "Tracking", body: "Once your order ships, tracking details are available in your Order History under your account." },
      ]}
    />
  );
}
