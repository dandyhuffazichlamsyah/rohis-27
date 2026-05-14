"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Kegiatan = {
  id: string;
  nama_kegiatan: string;
  tanggal: string;
  lokasi: string;
};

const fallbackEvent = {
  name: "Pesantren Kilat Ramadhan",
  date: "2026-03-05T07:00:00+07:00",
  location: "Masjid SMAN 27 Jakarta",
};

function getRemainingTime(targetDate: string) {
  const distance = new Date(targetDate).getTime() - Date.now();
  const safeDistance = Math.max(distance, 0);

  return {
    days: Math.floor(safeDistance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safeDistance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safeDistance / (1000 * 60)) % 60),
    seconds: Math.floor((safeDistance / 1000) % 60),
  };
}

export function EventCountdown() {
  const [nextEvent, setNextEvent] = useState(fallbackEvent);

  useEffect(() => {
    fetch("/api/public/kegiatan", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          const now = Date.now();
          const upcoming = result.data
            .filter((k: Kegiatan) => new Date(k.tanggal).getTime() > now)
            .sort((a: Kegiatan, b: Kegiatan) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())[0];
          if (upcoming) {
            setNextEvent({
              name: upcoming.nama_kegiatan,
              date: upcoming.tanggal,
              location: upcoming.lokasi,
            });
          }
        }
      })
      .catch(() => { });
  }, []);

  const [remaining, setRemaining] = useState(() => getRemainingTime(nextEvent.date));
  const formattedDate = useMemo(
    () => new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(new Date(nextEvent.date)),
    [nextEvent.date],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemainingTime(nextEvent.date));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [nextEvent.date]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-glow backdrop-blur"
    >
      <div className="flex items-start gap-4">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring" as const, stiffness: 300, damping: 20 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-gold"
        >
          <CalendarDays className="h-5 w-5" />
        </motion.span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-800/60">Event Berikutnya</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-emerald-950">{nextEvent.name}</h2>
          <p className="mt-1 text-sm text-emerald-950/65">{formattedDate} · {nextEvent.location}</p>
        </div>
      </div>

      <motion.div
        className="mt-6 grid grid-cols-4 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      >
        {Object.entries(remaining).map(([label, value]) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 20 } } }}
            className="rounded-2xl bg-cream p-4 text-center ring-1 ring-emerald-900/10"
          >
            <motion.span
              key={value}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block text-2xl font-black text-emerald-950"
            >
              {String(value).padStart(2, "0")}
            </motion.span>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-800/55">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
