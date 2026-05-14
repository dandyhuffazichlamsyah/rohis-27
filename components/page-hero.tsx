"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(214,168,79,0.24),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(6,78,59,0.14),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-islamic-pattern geometric-mask opacity-60" />
      <motion.div className="mx-auto max-w-4xl text-center" variants={container} initial="hidden" animate="visible">
        <motion.div variants={itemUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-4 py-2 text-sm font-bold text-emerald-900 shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-gold" /> {eyebrow}
        </motion.div>
        <motion.h1 variants={itemUp} className="mt-7 font-display text-5xl font-bold leading-tight text-emerald-950 sm:text-6xl">{title}</motion.h1>
        <motion.p variants={itemUp} className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-950/68">{description}</motion.p>
      </motion.div>
    </section>
  );
}
