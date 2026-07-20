import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        { heading: "What We Collect", body: "Account details you provide (name, email, shipping addresses) and order history needed to fulfil and support your purchases." },
        { heading: "Uploaded Files", body: "Files uploaded for custom orders are used only to produce your print and are not shared with third parties." },
        { heading: "How We Use Your Data", body: "To process orders, provide customer support, and — only if you opt in — send updates about new products and offers." },
        { heading: "Third Parties", body: "We share order data only with the shipping and payment providers required to fulfil your purchase." },
        { heading: "Your Rights", body: "You can request a copy of your data or ask us to delete your account at any time by contacting hello@amistrie.print." },
      ]}
    />
  );
}
