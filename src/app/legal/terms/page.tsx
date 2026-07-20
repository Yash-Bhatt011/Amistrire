import { LegalPage } from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="July 2026"
      sections={[
        { heading: "Acceptance of Terms", body: "By placing an order on Amistrié, you agree to these terms in full. If you disagree with any part, please don't use the site to place an order." },
        { heading: "Orders & Pricing", body: "Prices are shown in INR and include the base configuration of each product. Options like material, finish, and size may change the final price before checkout." },
        { heading: "Custom & Made-to-Order Items", body: "Custom prints are produced specifically for you based on the file or specification you provide, and print times vary by complexity and queue position." },
        { heading: "Intellectual Property", body: "Files you upload for custom printing remain your property. You confirm you have the right to reproduce any design you submit." },
        { heading: "Limitation of Liability", body: "Amistrié is not liable for indirect or consequential damages arising from the use of a printed product outside its intended purpose." },
      ]}
    />
  );
}
