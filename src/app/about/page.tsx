import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="Our Story"
        title="About Amistrié"
        description="A small print studio obsessed with the details most people try to hide."
      />

      <main className="mx-auto max-w-3xl px-6 py-16 sm:px-12">
        <div className="flex flex-col gap-10 text-sm leading-relaxed text-studio-ink/60">
          <div>
            <p className="mb-2 font-display text-lg text-studio-ink">Brand Story</p>
            <p>
              Amistrié started with a single observation: the layer lines that most 3D prints
              try to sand away are actually beautiful. We build every product around that idea —
              precision manufacturing that doesn&apos;t hide what it is.
            </p>
          </div>
          <div>
            <p className="mb-2 font-display text-lg text-studio-ink">Mission</p>
            <p>Make premium, personalized 3D-printed objects accessible without the wait times or minimums of traditional manufacturing.</p>
          </div>
          <div>
            <p className="mb-2 font-display text-lg text-studio-ink">Vision</p>
            <p>A future where custom, made-to-order objects are as easy to order as anything off a shelf — without sacrificing quality.</p>
          </div>
          <div>
            <p className="mb-2 font-display text-lg text-studio-ink">Printing Technology</p>
            <p>We run a fleet of FDM printers tuned for consistency, with every print monitored through its full cycle for layer adhesion and dimensional accuracy.</p>
          </div>
          <div>
            <p className="mb-2 font-display text-lg text-studio-ink">Quality Standards</p>
            <p>Every part is visually inspected against a reference model before packaging. Anything outside tolerance is reprinted, not shipped.</p>
          </div>
        </div>
      </main>

      <ProcessSection />
      <WhyChooseUsSection />
      <GallerySection />
      <Footer />
    </>
  );
}
