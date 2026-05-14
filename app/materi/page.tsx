"use client";

import Link from "next/link";
import { BookOpenText, CalendarDays, Download, FileText, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import type { Database } from "@/lib/database.types";

type Materi = Database["public"]["Tables"]["materi"]["Row"];

const tipeLabels: Record<string, string> = {
  Artikel: "Artikel",
  Materi: "Materi",
  Jadwal: "Jadwal",
};

function isImageUrl(url: string | null) {
  if (!url) return false;
  if (url.includes("googleusercontent.com") || url.includes("drive.google.com")) return true;
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext ?? "");
}

function toDirectImageUrl(url: string | null): string | null {
  if (!url) return url;
  if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function MateriPage() {
  const [materi, setMateri] = useState<Materi[]>([]);
  const [active, setActive] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/materi", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) setMateri(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const tipes = ["Semua", ...Array.from(new Set(materi.map((m) => m.tipe))).sort()];
  const filtered = active === "Semua" ? materi : materi.filter((m) => m.tipe === active);

  return (
    <div className="bg-cream">
      <PageHero eyebrow="Materi & Konten" title="Bank Materi Rohis" description="Kumpulan materi, artikel, dan jadwal kajian untuk mendukung kegiatan rohani Islam di SMAN 27." />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-8 flex flex-wrap items-center gap-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
            <motion.span variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } }} className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-2 text-sm font-bold text-emerald-900">
              <Filter className="h-4 w-4" /> Filter:
            </motion.span>
            {tipes.map((t) => (
              <motion.button
                key={t}
                variants={{ hidden: { opacity: 0, y: 10, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } } }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActive(t)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${active === t
                  ? "border-gold bg-emerald-900 text-white"
                  : "border-emerald-900/10 bg-white text-emerald-950 hover:border-gold"
                  }`}
              >
                {tipeLabels[t] ?? t}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <p className="text-center text-sm text-emerald-950/60">Memuat materi...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-12 text-center shadow-sm">
              <FileText className="mx-auto h-10 w-10 text-gold/50" />
              <p className="mt-3 text-sm font-semibold text-emerald-950/60">Belum ada materi.</p>
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" as const }}
                    whileHover={{ y: -5, boxShadow: "0 16px 32px -10px rgba(6,78,59,0.12)" }}
                    className="flex flex-col overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 shadow-sm"
                  >
                    {isImageUrl(item.image_url) ? (
                      <div className="relative h-48 w-full">
                        <img src={toDirectImageUrl(item.image_url)!} alt={item.judul} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                          {item.tipe}
                        </span>
                      </div>
                    ) : (
                      <div className={`bg-gradient-to-br p-6 text-white ${item.tipe === "Artikel"
                        ? "from-emerald-950 to-emerald-700"
                        : item.tipe === "Materi"
                          ? "from-gold to-amber-300 text-emerald-950"
                          : "from-teal-900 to-emerald-500"
                        }`}>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                          {item.tipe}
                        </span>
                        <h2 className="mt-4 font-display text-2xl font-bold leading-tight">{item.judul}</h2>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-950/55">
                        <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.created_at))}</span>
                      </div>
                      {item.content_body ? (
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-emerald-950/68">{item.content_body}</p>
                      ) : null}
                      <div className="mt-auto pt-5">
                        {item.file_url ? (
                          <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
                            <Download className="h-4 w-4" /> Unduh File
                          </a>
                        ) : item.content_body ? (
                          <Link href={`/materi/${item.id}`} className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-bold text-emerald-950 ring-1 ring-emerald-900/10 transition hover:bg-emerald-900 hover:text-white">
                            <BookOpenText className="h-4 w-4" /> Baca Konten
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
