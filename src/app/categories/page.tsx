import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryGridSection } from "@/components/sections/CategoryGridSection";

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="Browse"
        title="Categories"
        description="Every category we print in, from pocket-sized keychains to full wall art installations."
      />
      <main>
        <CategoryGridSection />
      </main>
      <Footer />
    </>
  );
}
