"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import dynamic from "next/dynamic";
import { useCategories } from "@/lib/catalog-hooks";
import { cn } from "@/lib/utils";

const MiniShape3D = dynamic(() => import("@/components/scene/MiniShape3D").then((m) => m.MiniShape3D), {
  ssr: false,
});

export function CategoryGridSection() {
  const categories = useCategories();

  return (
    <section className="relative bg-studio-concrete px-6 py-24 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
          Browse By Category
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Ten categories. Every kind of print.
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, i) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ?? Icons.Box;
          const hasBanner = Boolean(category.banner3DShape || category.bannerImage);

          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/products/${category.slug}`}
                className={cn(
                  "group flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-studio-line bg-studio-panel text-center transition-all duration-300 ease-cinematic",
                  "hover:-translate-y-1 hover:border-accent-cyan/40 hover:shadow-[0_0_30px_-10px_rgba(41,151,255,0.35)]",
                  hasBanner ? "p-0 pb-5" : "p-6"
                )}
              >
                {category.banner3DShape ? (
                  <div className="h-28 w-full bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10">
                    <MiniShape3D kind={category.banner3DShape} color={i % 2 === 0 ? "#2997ff" : "#bf5af2"} />
                  </div>
                ) : category.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={category.bannerImage} alt="" className="h-28 w-full object-cover" />
                ) : (
                  <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl border border-studio-line bg-studio-concrete transition-colors group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/10">
                    <Icon className="h-5 w-5 text-studio-ink/70 transition-colors group-hover:text-accent-cyan" />
                  </div>
                )}
                <div className={hasBanner ? "px-4" : ""}>
                  <p className="font-display text-sm text-studio-ink">{category.name}</p>
                  <p className="mt-1 text-[11px] text-studio-ink/40">{category.tagline}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
