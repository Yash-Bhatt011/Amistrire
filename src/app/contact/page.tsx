"use client";

import { useState } from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Get in Touch" title="Contact Us" />

      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2">
        <div>
          {sent ? (
            <div className="rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10 p-6 text-sm text-accent-cyan">
              Thanks — we typically reply within one business day.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex flex-col gap-4"
            >
              <input required placeholder="Name" className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
              <input required type="email" placeholder="Email" className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
              <input placeholder="Subject" className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
              <textarea required placeholder="Message" rows={5} className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
              <button type="submit" className="mt-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-studio-void hover:scale-[1.02]">
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-accent-cyan" />
            <div>
              <p className="text-sm text-studio-ink">Email</p>
              <a href="mailto:hello@amistrie.print" className="text-xs text-studio-ink/50 hover:text-studio-ink">hello@amistrie.print</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-accent-cyan" />
            <div>
              <p className="text-sm text-studio-ink">Phone</p>
              <p className="text-xs text-studio-ink/50">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-accent-cyan" />
            <div>
              <p className="text-sm text-studio-ink">Business Hours</p>
              <p className="text-xs text-studio-ink/50">Mon–Sat, 10am–7pm IST</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-accent-cyan" />
            <div>
              <p className="text-sm text-studio-ink">Studio</p>
              <p className="text-xs text-studio-ink/50">Surat, Gujarat, India</p>
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-studio-ink/40">
            <a href="#" className="hover:text-studio-ink">Instagram</a>
            <a href="#" className="hover:text-studio-ink">Twitter</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
