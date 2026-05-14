"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, Camera, HeartHandshake, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { EventCountdown } from "@/components/event-countdown";
import { PrayerTimesWidget } from "@/components/prayer-times-widget";
import { StaggerContainer, StaggerItem, HoverLift } from "@/components/motion";

const quickLinks = [
  {
    href: "/program",
    title: "Program Kegiatan",
    description: "Mentoring, PHBI, pesantren kilat, kajian, dan kegiatan sosial Islami.",
    icon: HeartHandshake,
  },
  {
    href: "/artikel",
    title: "Artikel Islami",
    description: "Bacaan ringan seputar akidah, fiqih, motivasi, dan kisah inspiratif.",
    icon: BookOpenText,
  },
  {
    href: "/galeri",
    title: "Galeri Rohis",
    description: "Dokumentasi kegiatan dan momen ukhuwah keluarga besar Rohis SMAN 27.",
    icon: Camera,
  },
];

const values = ["Ilmu", "Adab", "Ukhuwah", "Dakwah"];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const heroSlideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const popInItem = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
};

const sectionHeader = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="overflow-hidden bg-cream">
      <section className="relative isolate min-h-[calc(100vh-80px)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(214,168,79,0.28),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(6,78,59,0.16),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-islamic-pattern geometric-mask opacity-70" />
        <div className="absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full border border-gold/25" />
        <div className="absolute left-1/2 top-24 -z-10 h-56 w-56 -translate-x-1/2 rotate-45 rounded-[3rem] border border-emerald-900/10" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={heroContainer} initial="hidden" animate="visible">
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-emerald-900 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-gold" /> Rohani Islam SMAN 27 Jakarta
            </motion.div>

            <motion.h1 variants={heroItem} className="mt-8 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight text-emerald-950 sm:text-7xl lg:text-8xl">
              Rohis SMAN 27 Jakarta
            </motion.h1>

            <motion.p variants={heroItem} className="mt-6 max-w-2xl text-lg leading-8 text-emerald-950/70 sm:text-xl">
              Wadah bertumbuhnya generasi muslim yang cinta ilmu, berakhlak mulia, dan aktif menebar manfaat di lingkungan sekolah.
            </motion.p>

            <motion.blockquote variants={heroItem} className="mt-8 max-w-2xl rounded-[1.75rem] border border-gold/25 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="font-display text-3xl font-bold leading-relaxed text-emerald-950">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
              <p className="mt-3 text-sm leading-6 text-emerald-950/65">“Dan katakanlah: Ya Rabbku, tambahkanlah kepadaku ilmu.” QS. Thaha: 114</p>
            </motion.blockquote>

            <motion.div variants={heroItem} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}>
                <Link href="/kontak" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
                  Gabung Bersama Kami <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}>
                <Link href="/program" className="inline-flex items-center justify-center rounded-full border border-emerald-900/15 bg-white/70 px-6 py-3.5 text-sm font-bold text-emerald-950 transition hover:border-gold hover:text-emerald-800">
                  Lihat Program
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={heroContainer} className="mt-10 grid max-w-xl grid-cols-4 gap-3">
              {values.map((value) => (
                <motion.div key={value} variants={popInItem} className="rounded-2xl bg-white/65 p-3 text-center text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10 backdrop-blur">
                  {value}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={heroSlideRight} initial="hidden" animate="visible" className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-gold/25 via-white/20 to-emerald-900/15 blur-2xl" />
            <motion.div whileHover={{ y: -4, rotate: -1 }} transition={{ type: "spring" as const, stiffness: 200, damping: 15 }} className="rounded-[2.5rem] border border-emerald-900/10 bg-white/80 p-5 shadow-glow backdrop-blur-xl">
              <div className="rounded-[2rem] bg-emerald-950 p-8 text-center text-white">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] border border-gold/30 bg-white/10">
                  <Star className="h-12 w-12 fill-gold text-gold" />
                </motion.div>
                <p className="mt-7 font-display text-5xl font-bold text-gold">الحكمة</p>
                <p className="mt-4 text-sm leading-6 text-emerald-50/70">Menjadi cahaya kebaikan melalui ilmu, ibadah, dan persaudaraan.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <PrayerTimesWidget />
          <EventCountdown />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div className="max-w-2xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionHeader}>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Jelajahi Rohis</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-emerald-950 sm:text-5xl">Mulai dari program, literasi, hingga dokumentasi kegiatan.</h2>
          </motion.div>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <StaggerItem key={item.href}>
                  <HoverLift>
                    <Link href={item.href} className="group block rounded-[2rem] border border-emerald-900/10 bg-white/75 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
                      <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-900 text-gold transition group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-bold text-emerald-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-emerald-950/65">{item.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition group-hover:text-gold">
                        Buka halaman <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
