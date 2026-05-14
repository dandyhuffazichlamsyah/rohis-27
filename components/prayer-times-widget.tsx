"use client";

import { Clock, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const prayerLabels: Array<[keyof PrayerTimes, string]> = [
  ["Fajr", "Subuh"],
  ["Dhuhr", "Dzuhur"],
  ["Asr", "Ashar"],
  ["Maghrib", "Maghrib"],
  ["Isha", "Isya"],
];

function cleanTime(value: string) {
  return value.replace(/\s\(.+\)/, "");
}

export function PrayerTimesWidget() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=20");

        if (!response.ok) {
          throw new Error("Gagal memuat jadwal sholat");
        }

        const result = await response.json();
        setTimes(result.data.timings);
        setError(null);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan saat memuat jadwal sholat");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrayerTimes();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 text-white shadow-glow"
    >
      <div className="relative p-6">
        <div className="absolute inset-0 bg-islamic-pattern geometric-mask opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Jadwal Sholat</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Jakarta Hari Ini</h2>
            </div>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" as const, stiffness: 300, damping: 20 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/10"
            >
              {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
            </motion.span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-50/70">
            <MapPin className="h-4 w-4 text-gold" /> Kota Jakarta, Indonesia
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl bg-red-500/15 p-4 text-sm text-red-100 ring-1 ring-red-300/20">{error}</div>
          ) : (
            <motion.div
              className="mt-6 grid gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
            >
              {prayerLabels.map(([key, label]) => (
                <motion.div
                  key={key}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } } }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 transition-colors"
                >
                  <span className="font-semibold text-emerald-50/85">{label}</span>
                  <span className="font-mono text-lg font-bold text-gold">{times ? cleanTime(times[key]) : "--:--"}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
