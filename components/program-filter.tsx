"use client";

import { CalendarCheck, Clock, MapPin, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Database } from "@/lib/database.types";

const staticCategories = ["Semua", "Kajian", "Sosial", "Shalat"] as const;

const staticPrograms = [
  {
    id: "static-1",
    title: "Mentoring Pekanan",
    category: "Kajian",
    description: "Kelompok kecil pembinaan akhlak, tilawah, dan diskusi keislaman bersama mentor.",
    schedule: "Setiap Jumat",
    participants: "Kelas X-XII",
  },
  {
    id: "static-2",
    title: "Kajian Tematik",
    category: "Kajian",
    description: "Kajian ringan bersama alumni, guru, atau ustadz dengan tema dekat kehidupan pelajar.",
    schedule: "Sabtu pekan kedua",
    participants: "Terbuka untuk siswa",
  },
  {
    id: "static-3",
    title: "PHBI Sekolah",
    category: "Sosial",
    description: "Peringatan hari besar Islam dengan lomba, tabligh akbar, dan kegiatan kolaboratif OSIS.",
    schedule: "Sesuai kalender hijriah",
    participants: "Warga sekolah",
  },
  {
    id: "static-4",
    title: "Pesantren Kilat",
    category: "Kajian",
    description: "Program intensif Ramadhan untuk memperkuat ibadah, ilmu, dan kepedulian sosial.",
    schedule: "Bulan Ramadhan",
    participants: "Kelas X-XI",
  },
  {
    id: "static-5",
    title: "Gerakan Jumat Berkah",
    category: "Sosial",
    description: "Aksi berbagi makanan, infak, dan kepedulian untuk sekitar sekolah.",
    schedule: "Jumat pagi",
    participants: "Relawan Rohis",
  },
  {
    id: "static-6",
    title: "Mabit & Qiyamul Lail",
    category: "Shalat",
    description: "Malam bina iman dan takwa dengan tilawah, muhasabah, dan sholat malam berjamaah.",
    schedule: "Sesuai agenda",
    participants: "Anggota Rohis",
  },
];

type Kegiatan = Database["public"]["Tables"]["kegiatan"]["Row"];

type ProgramItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  schedule: string;
  participants: string;
};

export function ProgramFilter() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [apiPrograms, setApiPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasApiData, setHasApiData] = useState(false);

  useEffect(() => {
    fetch("/api/public/kegiatan", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          const mapped: ProgramItem[] = result.data.map((k: Kegiatan) => ({
            id: k.id,
            title: k.nama_kegiatan,
            category: k.jenis || "Lainnya",
            description: k.deskripsi || "Kegiatan Rohis SMAN 27 Jakarta.",
            schedule: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(k.tanggal)) + " · " + k.lokasi,
            participants: "Anggota & siswa",
          }));
          setApiPrograms(mapped);
          setHasApiData(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const programs = hasApiData ? apiPrograms : staticPrograms;
  const categories = useMemo(() => {
    const set = new Set<string>(["Semua"]);
    programs.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [programs]);

  const filteredPrograms = useMemo(
    () => programs.filter((program) => activeCategory === "Semua" || program.category === activeCategory),
    [activeCategory, programs],
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeCategory === category
              ? "bg-emerald-900 text-white shadow-glow"
              : "border border-emerald-900/10 bg-white/75 text-emerald-950 hover:border-gold"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {!hasApiData && !loading && (
        <p className="mt-6 text-center text-xs text-emerald-950/40">Menampilkan program default — tambahkan kegiatan di admin untuk data real-time.</p>
      )}

      {loading ? (
        <p className="mt-10 text-center text-sm text-emerald-950/60">Memuat program kegiatan...</p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <article key={program.id} className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{program.category}</span>
                <CalendarCheck className="h-5 w-5 text-gold" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950">{program.title}</h2>
              <p className="mt-3 text-sm leading-6 text-emerald-950/65">{program.description}</p>
              <div className="mt-6 grid gap-3 text-sm text-emerald-950/70">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {program.schedule}</span>
                <span className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-gold" /> {program.participants}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
