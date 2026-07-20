import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomPrintingSection } from "@/components/sections/CustomPrintingSection";
import { FilamentSection } from "@/components/sections/FilamentSection";

export default function CustomOrdersPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="Custom Orders"
        title="Print Something of Your Own"
        description="Upload a file, pick a material, and get an instant estimate — no minimums, no back-and-forth quoting."
      />
      <CustomPrintingSection />
      <FilamentSection />
      <Footer />
    </>
  );
}
