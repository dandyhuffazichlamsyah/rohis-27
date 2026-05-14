import type { Metadata } from "next";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Rohis SMAN 27 untuk pertanyaan, kerja sama, atau informasi kegiatan. Tersedia form kontak dan media sosial.",
};

export default function KontakPage() {
  return (
    <div className="bg-cream">
      <PageHero eyebrow="Hubungi Kami" title="Mari Terhubung dengan Rohis" description="Punya pertanyaan, ingin bergabung, atau berkolaborasi dalam kegiatan kebaikan? Kirim pesan melalui halaman ini." />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ContactForm />

          <div className="grid gap-5">
            <div className="rounded-[2rem] bg-emerald-950 p-8 text-white shadow-glow">
              <h2 className="font-display text-4xl font-bold">Info Kontak</h2>
              <div className="mt-7 grid gap-4 text-sm text-emerald-50/78">
                <span className="flex items-center gap-3"><MapPin className="h-5 w-5 text-gold" /> SMAN 27 Jakarta</span>
                <span className="flex items-center gap-3"><Instagram className="h-5 w-5 text-gold" /> @rohis.sman27</span>
                <span className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-gold" /> WhatsApp Rohis</span>
                <span className="flex items-center gap-3"><Mail className="h-5 w-5 text-gold" /> rohis@sman27.sch.id</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.616739863737!2d106.85875672499007!3d-6.182021893805478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f50035cd5fa1%3A0x17c0bbeb39b97875!2sMasjid%20Nurul%20Iman%20(Base%20Camp%20Rohis%2027)!5e0!3m2!1sid!2sid!4v1778751791897!5m2!1sid!2sid"
                className="h-80 w-full border-0 sm:h-96"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Base Camp Rohis SMAN 27"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
