"use client";

import { Clock, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

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
    <section className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 text-white shadow-glow">
      <div className="relative p-6">
        <div className="absolute inset-0 bg-islamic-pattern geometric-mask opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Jadwal Sholat</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Jakarta Hari Ini</h2>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/10">
              {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-50/70">
            <MapPin className="h-4 w-4 text-gold" /> Kota Jakarta, Indonesia
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl bg-red-500/15 p-4 text-sm text-red-100 ring-1 ring-red-300/20">{error}</div>
          ) : (
            <div className="mt-6 grid gap-3">
              {prayerLabels.map(([key, label]) => (
                <div key={key} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                  <span className="font-semibold text-emerald-50/85">{label}</span>
                  <span className="font-mono text-lg font-bold text-gold">{times ? cleanTime(times[key]) : "--:--"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
