"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-emerald-950/75 transition hover:text-emerald-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/kontak" className="hidden rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800 md:inline-flex">
          Gabung Rohis
        </Link>

        <button onClick={() => setOpen((v) => !v)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-950 md:hidden" aria-label="Buka menu navigasi">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-emerald-900/10 bg-cream px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-900/5 hover:text-emerald-700">
                {item.label}
              </Link>
            ))}
            <Link href="/kontak" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
              Gabung Rohis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
