"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/about", label: "Tentang" },
  { href: "/program", label: "Program" },
  { href: "/materi", label: "Materi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/pengurus", label: "Pengurus" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/Logo-rohis.png" alt="Logo Rohis SMAN 27" className="h-11 w-11 rounded-2xl object-contain shadow-glow" />
          <span>
            <span className="block font-display text-xl font-bold leading-none text-emerald-950">Rohis SMAN 27</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-800/70">Jakarta</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.4 }}>
              <Link href={item.href} className="relative text-sm font-semibold text-emerald-950/75 transition hover:text-emerald-700">
                {item.label}
                <motion.span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold" whileHover={{ width: "100%" }} transition={{ duration: 0.25 }} />
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.4 }} className="hidden md:block">
          <Link href="/kontak" className="inline-flex rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
            Gabung Rohis
          </Link>
        </motion.div>

        <button onClick={() => setOpen((v) => !v)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-950 md:hidden" aria-label="Buka menu navigasi">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden border-t border-emerald-900/10 bg-cream md:hidden"
          >
            <nav className="flex flex-col gap-3 px-4 py-4">
              {navItems.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i, duration: 0.35 }}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-900/5 hover:text-emerald-700">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.35 }}>
                <Link href="/kontak" onClick={() => setOpen(false)} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
                  Gabung Rohis
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
