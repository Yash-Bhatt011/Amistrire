import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CategoryGridSection } from "@/components/sections/CategoryGridSection";
import { ProductShowcaseTabs } from "@/components/sections/ProductShowcaseTabs";
import { CustomPrintingSection } from "@/components/sections/CustomPrintingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { GallerySection } from "@/components/sections/GallerySection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <div id="categories">
          <CategoryGridSection />
        </div>
        <div id="products">
          <ProductShowcaseTabs />
        </div>
        <div id="custom">
          <CustomPrintingSection />
        </div>
        <ProcessSection />
        <WhyChooseUsSection />
        <ReviewsSection />
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}
