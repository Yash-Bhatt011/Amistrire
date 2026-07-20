import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <PageHeader eyebrow="My Account" title="Order History" />
      <AccountDashboard initialTab="orders" />
      <Footer />
    </>
  );
}
