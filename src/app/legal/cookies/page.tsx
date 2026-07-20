import { LegalPage } from "@/components/legal/LegalPage";

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="July 2026"
      sections={[
        { heading: "Essential Storage", body: "We use local browser storage to keep your cart, wishlist, and login session working between visits. The site won't function correctly without it." },
        { heading: "Preferences", body: "Your recent searches and recently viewed products are stored locally so we can show relevant suggestions." },
        { heading: "No Third-Party Ad Tracking", body: "We don't use third-party advertising trackers or sell browsing data." },
        { heading: "Managing Storage", body: "You can clear cart, wishlist, and account data at any time by clearing your browser's site data for this domain." },
      ]}
    />
  );
}
