"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
  { href: "/about", label: "Tentang Rohis" },
  { href: "/program", label: "Program" },
  { href: "/materi", label: "Materi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/admin/login", label: "Login Admin" },
];

const footerSlide = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const footerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-950 text-emerald-50">
      <motion.div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={footerContainer}>
        <motion.div variants={footerSlide}>
          <div className="flex items-center gap-3">
            <img src="/Logo-rohis.png" alt="Logo Rohis SMAN 27" className="h-11 w-11 rounded-2xl object-contain" />
            <div>
              <p className="font-display text-2xl font-bold">Rohis SMAN 27 Jakarta</p>
              <p className="text-sm text-emerald-100/70">Rohani Islam yang bertumbuh dalam ilmu, adab, dan ukhuwah.</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={footerSlide}>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-gold">Navigasi</h2>
          <div className="grid gap-3">
            {footerLinks.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i, duration: 0.3 }}>
                <Link href={item.href} className="text-sm text-emerald-50/75 transition hover:text-gold">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={footerSlide}>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-gold">Kontak</h2>
          <div className="grid gap-3 text-sm text-emerald-50/75">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> SMAN 27 Jakarta</span>
            <a href="https://www.instagram.com/rohissman27/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-gold"><Instagram className="h-4 w-4 text-gold" /> @rohissman27</a>
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-gold" /> WhatsApp Rohis</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> rohis@sman27.sch.id</span>
          </div>
        </motion.div>
      </motion.div>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-4 py-5 text-center text-xs text-emerald-50/55 sm:flex-row">
        <span>© {new Date().getFullYear()} Rohis SMAN 27 Jakarta. Dibangun untuk dakwah sekolah yang modern dan bermanfaat.</span>
        <Link href="/admin/login" className="transition hover:text-gold">Login Admin</Link>
      </div>
    </footer>
  );
}
