"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarPlus, Pencil, RefreshCw, Trash2, UserPlus, X } from "lucide-react";
import type { Database } from "@/lib/database.types";

type Anggota = Database["public"]["Tables"]["anggota"]["Row"];
type Kegiatan = Database["public"]["Tables"]["kegiatan"]["Row"];
type LoadState = "idle" | "loading" | "success" | "error";
type Source = "fallback" | "supabase";

type ApiListResponse<T> = {
  data: T[];
  source?: Source;
  message?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

async function readJson<T>(response: Response): Promise<T> {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Terjadi kesalahan pada server.");
  }
  return result;
}

export function AdminCrudPanel() {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [anggotaSource, setAnggotaSource] = useState<Source>("fallback");
  const [kegiatanSource, setKegiatanSource] = useState<Source>("fallback");
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [anggotaMessage, setAnggotaMessage] = useState("");
  const [kegiatanMessage, setKegiatanMessage] = useState("");

  const [editingAnggota, setEditingAnggota] = useState<Anggota | null>(null);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);

  async function loadData() {
    setLoadState("loading");
    try {
      const [anggotaResponse, kegiatanResponse] = await Promise.all([
        fetch("/api/anggota", { cache: "no-store" }),
        fetch("/api/kegiatan", { cache: "no-store" }),
      ]);
      const [anggotaResult, kegiatanResult] = await Promise.all([
        readJson<ApiListResponse<Anggota>>(anggotaResponse),
        readJson<ApiListResponse<Kegiatan>>(kegiatanResponse),
      ]);
      setAnggota(anggotaResult.data);
      setKegiatan(kegiatanResult.data);
      setAnggotaSource(anggotaResult.source ?? "supabase");
      setKegiatanSource(kegiatanResult.source ?? "supabase");
      setLoadState("success");
    } catch (error) {
      setLoadState("error");
      setAnggotaMessage(error instanceof Error ? error.message : "Gagal memuat data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAnggotaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setAnggotaMessage(editingAnggota ? "Memperbarui anggota..." : "Menyimpan anggota...");
    const formData = new FormData(form);
    const payload = {
      nama: String(formData.get("nama") ?? ""),
      kelas: String(formData.get("kelas") ?? ""),
      jabatan: String(formData.get("jabatan") ?? ""),
      periode_kepengurusan: String(formData.get("periode_kepengurusan") ?? ""),
    };

    try {
      if (editingAnggota) {
        await readJson(
          await fetch("/api/anggota", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, id: editingAnggota.id }),
          }),
        );
        setEditingAnggota(null);
        setAnggotaMessage("Anggota berhasil diperbarui.");
      } else {
        await readJson<{ data: Anggota }>(
          await fetch("/api/anggota", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        form.reset();
        setAnggotaMessage("Anggota berhasil ditambahkan.");
      }
      await loadData();
    } catch (error) {
      setAnggotaMessage(error instanceof Error ? error.message : "Gagal menyimpan anggota.");
    }
  }

  async function handleKegiatanSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setKegiatanMessage(editingKegiatan ? "Memperbarui kegiatan..." : "Menyimpan kegiatan...");
    const formData = new FormData(form);
    const payload = {
      nama_kegiatan: String(formData.get("nama_kegiatan") ?? ""),
      jenis: String(formData.get("jenis") ?? ""),
      tanggal: String(formData.get("tanggal") ?? ""),
      lokasi: String(formData.get("lokasi") ?? ""),
      deskripsi: String(formData.get("deskripsi") ?? ""),
    };

    try {
      if (editingKegiatan) {
        await readJson(
          await fetch("/api/kegiatan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, id: editingKegiatan.id }),
          }),
        );
        setEditingKegiatan(null);
        setKegiatanMessage("Kegiatan berhasil diperbarui.");
      } else {
        await readJson<{ data: Kegiatan }>(
          await fetch("/api/kegiatan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        form.reset();
        setKegiatanMessage("Kegiatan berhasil ditambahkan.");
      }
      await loadData();
    } catch (error) {
      setKegiatanMessage(error instanceof Error ? error.message : "Gagal menyimpan kegiatan.");
    }
  }

  async function deleteAnggota(id: string) {
    if (!confirm("Hapus anggota ini?")) return;
    setAnggotaMessage("Menghapus anggota...");
    try {
      await readJson(
        await fetch("/api/anggota", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }),
      );
      setAnggotaMessage("Anggota berhasil dihapus.");
      await loadData();
    } catch (error) {
      setAnggotaMessage(error instanceof Error ? error.message : "Gagal menghapus anggota.");
    }
  }

  async function deleteKegiatan(id: string) {
    if (!confirm("Hapus kegiatan ini?")) return;
    setKegiatanMessage("Menghapus kegiatan...");
    try {
      await readJson(
        await fetch("/api/kegiatan", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }),
      );
      setKegiatanMessage("Kegiatan berhasil dihapus.");
      await loadData();
    } catch (error) {
      setKegiatanMessage(error instanceof Error ? error.message : "Gagal menghapus kegiatan.");
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">CRUD Admin</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-emerald-950">Kelola Anggota & Kegiatan</h2>
          <p className="mt-2 text-sm text-emerald-950/60">Tambah, edit, dan hapus anggota serta kegiatan melalui API serverless ke Supabase.</p>
        </div>
        <button onClick={loadData} className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-emerald-900/10 bg-cream px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:border-gold">
          <RefreshCw className={`h-4 w-4 ${loadState === "loading" ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] bg-cream p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-3xl font-bold text-emerald-950">{editingAnggota ? "Edit Anggota" : "Tambah Anggota"}</h3>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{anggotaSource}</span>
          </div>
          <form onSubmit={handleAnggotaSubmit} className="mt-5 grid gap-4">
            <input name="nama" required defaultValue={editingAnggota?.nama ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Nama anggota" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="kelas" required defaultValue={editingAnggota?.kelas ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Kelas" />
              <select name="jabatan" className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue={editingAnggota?.jabatan ?? ""}>
                <option value="">Anggota (tanpa jabatan)</option>
                <option value="Ketua Rohis">Ketua Rohis</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Koordinator Divisi">Koordinator Divisi</option>
                <option value="Anggota Aktif">Anggota Aktif</option>
              </select>
            </div>
            <input name="periode_kepengurusan" required defaultValue={editingAnggota?.periode_kepengurusan ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Periode, contoh: 2025/2026" />
            {anggotaMessage ? <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-950/70">{anggotaMessage}</p> : null}
            <div className="flex gap-3">
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
                {editingAnggota ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />} {editingAnggota ? "Update" : "Simpan"} Anggota
              </button>
              {editingAnggota ? (
                <button type="button" onClick={() => setEditingAnggota(null)} className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-3 text-sm font-bold text-emerald-950 transition hover:border-gold">
                  <X className="h-4 w-4" /> Batal
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-6 grid gap-3">
            {anggota.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-emerald-900/10">
                <div className="min-w-0">
                  <p className="truncate font-bold text-emerald-950">{member.nama}</p>
                  <p className="mt-1 text-sm text-emerald-950/60">{member.jabatan ?? "Anggota"} · {member.kelas} · {member.periode_kepengurusan}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => setEditingAnggota(member)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-emerald-900 transition hover:bg-gold/25" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteAnggota(member.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-cream p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-3xl font-bold text-emerald-950">{editingKegiatan ? "Edit Kegiatan" : "Tambah Kegiatan"}</h3>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{kegiatanSource}</span>
          </div>
          <form onSubmit={handleKegiatanSubmit} className="mt-5 grid gap-4">
            <input name="nama_kegiatan" required defaultValue={editingKegiatan?.nama_kegiatan ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Nama kegiatan" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="jenis" required className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue={editingKegiatan?.jenis ?? ""}>
                <option value="" disabled>Pilih jenis</option>
                <option value="Kajian">Kajian</option>
                <option value="Sosial">Sosial</option>
                <option value="Shalat">Shalat</option>
                <option value="Pengajian">Pengajian</option>
                <option value="PHBI">PHBI</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Pesantren Kilat">Pesantren Kilat</option>
                <option value="Mabit">Mabit</option>
                <option value="Dakwah">Dakwah</option>
                <option value="Lomba">Lomba</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <input
                name="tanggal"
                type="datetime-local"
                required
                defaultValue={editingKegiatan ? new Date(editingKegiatan.tanggal).toISOString().slice(0, 16) : ""}
                className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
              />
            </div>
            <input name="lokasi" required defaultValue={editingKegiatan?.lokasi ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Lokasi" />
            <textarea name="deskripsi" rows={3} defaultValue={editingKegiatan?.deskripsi ?? ""} className="resize-none rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Deskripsi singkat" />
            {kegiatanMessage ? <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-950/70">{kegiatanMessage}</p> : null}
            <div className="flex gap-3">
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
                {editingKegiatan ? <Pencil className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />} {editingKegiatan ? "Update" : "Simpan"} Kegiatan
              </button>
              {editingKegiatan ? (
                <button type="button" onClick={() => setEditingKegiatan(null)} className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-3 text-sm font-bold text-emerald-950 transition hover:border-gold">
                  <X className="h-4 w-4" /> Batal
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-6 grid gap-3">
            {kegiatan.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-emerald-900/10">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate font-bold text-emerald-950">{event.nama_kegiatan}</p>
                    <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{event.jenis}</span>
                  </div>
                  <p className="mt-1 text-sm text-emerald-950/60">{formatDate(event.tanggal)} · {event.lokasi}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => setEditingKegiatan(event)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-emerald-900 transition hover:bg-gold/25" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteKegiatan(event.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
