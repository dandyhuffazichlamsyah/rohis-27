"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle, ClipboardList } from "lucide-react";
import type { Database } from "@/lib/database.types";

type Anggota = Database["public"]["Tables"]["anggota"]["Row"];
type Kegiatan = Database["public"]["Tables"]["kegiatan"]["Row"];
type Absensi = Database["public"]["Tables"]["absensi"]["Row"] & {
  anggota?: { nama: string; kelas: string };
  kegiatan?: { nama_kegiatan: string; tanggal: string };
};

type ApiListResponse<T> = {
  data: T[];
  source?: string;
  message?: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Terjadi kesalahan pada server.");
  }
  return result;
}

export function AbsensiPanel() {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [anggotaRes, kegiatanRes, absensiRes] = await Promise.all([
        fetch("/api/anggota", { cache: "no-store" }),
        fetch("/api/kegiatan", { cache: "no-store" }),
        fetch("/api/absensi", { cache: "no-store" }),
      ]);
      const [anggotaResult, kegiatanResult, absensiResult] = await Promise.all([
        readJson<ApiListResponse<Anggota>>(anggotaRes),
        readJson<ApiListResponse<Kegiatan>>(kegiatanRes),
        readJson<ApiListResponse<Absensi>>(absensiRes),
      ]);
      setAnggota(anggotaResult.data);
      setKegiatan(kegiatanResult.data);
      setAbsensi(absensiResult.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat data absensi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("Menyimpan absensi...");
    const formData = new FormData(form);
    const payload = {
      kegiatan_id: String(formData.get("kegiatan_id") ?? ""),
      anggota_id: String(formData.get("anggota_id") ?? ""),
      status: String(formData.get("status") ?? ""),
    };

    try {
      await readJson(
        await fetch("/api/absensi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
      form.reset();
      setMessage("Absensi berhasil dicatat.");
      await loadAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mencatat absensi.");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "Hadir": return "bg-emerald-100 text-emerald-800";
      case "Izin": return "bg-amber-100 text-amber-800";
      case "Sakit": return "bg-blue-100 text-blue-800";
      case "Alpa": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
        <p className="text-sm text-emerald-950/60">Memuat data absensi...</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Absensi</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-emerald-950">Catat Kehadiran</h2>
          <p className="mt-2 text-sm text-emerald-950/60">Pilih kegiatan dan anggota, lalu tandai status kehadirannya.</p>
        </div>
        <button onClick={loadAll} className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-900/10 bg-cream px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:border-gold">
          <ClipboardList className="h-4 w-4" /> Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[1.5rem] bg-cream p-5 ring-1 ring-emerald-900/10 md:grid-cols-4">
        <select name="kegiatan_id" required className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue="">
          <option value="" disabled>Pilih kegiatan</option>
          {kegiatan.map((event) => (
            <option key={event.id} value={event.id}>{event.nama_kegiatan}</option>
          ))}
        </select>
        <select name="anggota_id" required className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue="">
          <option value="" disabled>Pilih anggota</option>
          {anggota.map((member) => (
            <option key={member.id} value={member.id}>{member.nama} · {member.kelas}</option>
          ))}
        </select>
        <select name="status" required className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue="">
          <option value="" disabled>Status</option>
          <option value="Hadir">Hadir</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alpa">Alpa</option>
        </select>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
          <CheckCircle className="h-4 w-4" /> Simpan
        </button>
      </form>

      {message ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold text-emerald-950/70">{message}</p> : null}

      <div className="mt-6 grid gap-3">
        {absensi.length === 0 ? (
          <p className="rounded-2xl bg-cream p-4 text-center text-sm text-emerald-950/60 ring-1 ring-emerald-900/10">Belum ada data absensi.</p>
        ) : (
          absensi.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream p-4 ring-1 ring-emerald-900/10">
              <div className="min-w-0">
                <p className="truncate font-bold text-emerald-950">{row.anggota?.nama ?? "—"} · {row.anggota?.kelas ?? ""}</p>
                <p className="mt-1 text-sm text-emerald-950/60">{row.kegiatan?.nama_kegiatan ?? "—"}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${getStatusColor(row.status)}`}>{row.status}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
