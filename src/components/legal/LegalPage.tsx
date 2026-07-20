import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Legal" title={title} description={`Last updated ${updated}`} />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-studio-ink/60">
          {sections.map((s) => (
            <div key={s.heading}>
              <p className="mb-2 font-display text-base text-studio-ink">{s.heading}</p>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
