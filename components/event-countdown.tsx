"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const nextEvent = {
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
  const [remaining, setRemaining] = useState(() => getRemainingTime(nextEvent.date));
  const formattedDate = useMemo(
    () => new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(new Date(nextEvent.date)),
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemainingTime(nextEvent.date));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-glow backdrop-blur">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-gold">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-800/60">Event Berikutnya</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-emerald-950">{nextEvent.name}</h2>
          <p className="mt-1 text-sm text-emerald-950/65">{formattedDate} · {nextEvent.location}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {Object.entries(remaining).map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-cream p-4 text-center ring-1 ring-emerald-900/10">
            <span className="block text-2xl font-black text-emerald-950">{String(value).padStart(2, "0")}</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-800/55">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
