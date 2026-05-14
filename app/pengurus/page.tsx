"use client";

import { Crown, Gem, Shield, Star, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import type { Database } from "@/lib/database.types";

type Anggota = Database["public"]["Tables"]["anggota"]["Row"];

type Member = { nama: string; jabatan: string; kelas: string };

const coreRoles = ["Ketua Rohis", "Wakil Ketua", "Sekretaris", "Bendahara"];

const fallbackMembers: Member[] = [
  { nama: "Ahmad Fauzan", jabatan: "Ketua Rohis", kelas: "XI IPA" },
  { nama: "Naila Zahra", jabatan: "Wakil Ketua", kelas: "XI IPS" },
  { nama: "Salsabila Putri", jabatan: "Sekretaris", kelas: "XI IPA" },
  { nama: "Muhammad Iqbal", jabatan: "Bendahara", kelas: "XI IPS" },
];

const divisions = ["Syiar & Dakwah", "Kaderisasi", "Media Kreatif", "Keputrian", "Sosial", "Perlengkapan"];

const roleIcon: Record<string, React.ElementType> = {
  "Ketua Rohis": Crown,
  "Wakil Ketua": Star,
  Sekretaris: Shield,
  Bendahara: Gem,
};

function normalizeJabatan(raw: string | null): string {
  if (!raw) return "Anggota";
  const lower = raw.toLowerCase();
  if (lower.includes("ketua") && !lower.includes("wakil")) return "Ketua Rohis";
  if (lower.includes("wakil")) return "Wakil Ketua";
  if (lower.includes("sekretaris") || lower.includes("sekre")) return "Sekretaris";
  if (lower.includes("bendahara") || lower.includes("benda")) return "Bendahara";
  return raw;
}

function sortCore(list: Member[]) {
  return [...list].sort((a, b) => coreRoles.indexOf(a.jabatan) - coreRoles.indexOf(b.jabatan));
}

function MemberCard({ person, size = "md" }: { person: Member; size?: "lg" | "md" }) {
  const Icon = roleIcon[person.jabatan] || UsersRound;
  const isLg = size === "lg";
  return (
    <motion.article
      whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(6,78,59,0.15)" }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className={`rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 text-center shadow-sm ${isLg ? "mx-auto max-w-sm" : ""}`}
    >
      <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }} className={`mx-auto flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-950 to-emerald-700 text-gold ${isLg ? "h-36 w-36" : "h-28 w-28"}`}>
        <Icon className={isLg ? "h-16 w-16" : "h-12 w-12"} />
      </motion.div>
      <h2 className={`mt-6 font-display font-bold text-emerald-950 ${isLg ? "text-3xl" : "text-2xl"}`}>{person.nama}</h2>
      <p className="mt-1 text-sm font-bold text-gold">{person.jabatan}</p>
      <p className="mt-2 text-sm text-emerald-950/60">{person.kelas}</p>
    </motion.article>
  );
}

export default function PengurusPage() {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/anggota", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) setAnggota(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const allMembers: Member[] = anggota.length
    ? anggota.map((a) => ({ nama: a.nama, jabatan: normalizeJabatan(a.jabatan), kelas: a.kelas }))
    : fallbackMembers;

  const core = sortCore(allMembers.filter((m) => coreRoles.includes(m.jabatan)));
  const others = allMembers.filter((m) => !coreRoles.includes(m.jabatan));

  const ketua = core.find((m) => m.jabatan === "Ketua Rohis");
  const wakil = core.find((m) => m.jabatan === "Wakil Ketua");
  const sekben = core.filter((m) => m.jabatan === "Sekretaris" || m.jabatan === "Bendahara");

  const hasData = anggota.length > 0;

  return (
    <div className="bg-cream">
      <PageHero eyebrow="Struktur Organisasi" title="Pengurus Rohis SMAN 27 Jakarta" description="Tim pengurus yang menggerakkan program Rohis melalui amanah, kolaborasi, dan semangat pelayanan." />

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <p className="text-center text-sm text-emerald-950/60">Memuat data pengurus...</p>
          ) : (
            <>
              {/* Hierarchy */}
              <motion.div
                className="flex flex-col items-center gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              >
                {ketua && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }} className="w-full">
                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.28em] text-gold">Ketua Umum</p>
                    <MemberCard person={ketua} size="lg" />
                  </motion.div>
                )}

                {ketua && wakil && <div className="h-8 w-px bg-emerald-900/20" />}

                {wakil && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }} className="w-full">
                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.28em] text-gold">Wakil Ketua</p>
                    <div className="mx-auto max-w-sm"><MemberCard person={wakil} /></div>
                  </motion.div>
                )}

                {wakil && sekben.length > 0 && <div className="h-8 w-px bg-emerald-900/20" />}

                {sekben.length > 0 && (
                  <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }} className="w-full">
                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.28em] text-gold">Sekretaris & Bendahara</p>
                    <motion.div className="mx-auto grid max-w-2xl gap-5 md:grid-cols-2" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                      {sekben.map((person) => (
                        <motion.div key={person.nama} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } } }}>
                          <MemberCard person={person} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Other Members */}
              {others.length > 0 && (
                <motion.div className="mt-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }} className="mb-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Anggota & Tim Kerja</p>
                    <h3 className="mt-2 font-display text-3xl font-bold text-emerald-950">Anggota Aktif</h3>
                    {!hasData && <p className="mt-1 text-sm text-emerald-950/50">Data demo — tambahkan anggota di admin untuk menampilkan yang asli.</p>}
                  </motion.div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {others.map((person, i) => (
                      <motion.div key={person.nama} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" as const }}>
                        <MemberCard person={person} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-emerald-950 p-8 text-white shadow-glow">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Divisi</p>
              <h2 className="mt-3 font-display text-4xl font-bold">Tim Kerja Rohis</h2>
            </div>
            <UsersRound className="h-10 w-10 text-gold" />
          </div>
          <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
            {divisions.map((division) => (
              <motion.div key={division} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 20 } } }} whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.2)" }} className="rounded-2xl bg-white/10 p-5 font-bold text-emerald-50 ring-1 ring-white/10 transition-colors">
                {division}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
