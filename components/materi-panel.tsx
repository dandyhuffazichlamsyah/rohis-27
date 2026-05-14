"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookOpenText, FileText, Pencil, RefreshCw, Trash2, X } from "lucide-react";
import type { Database } from "@/lib/database.types";

type Materi = Database["public"]["Tables"]["materi"]["Row"];

type ApiListResponse<T> = {
  data: T[];
  source?: string;
  message?: string;
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

async function readJson<T>(response: Response): Promise<T> {
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? "Terjadi kesalahan pada server.");
  return result;
}

export function MateriPanel() {
  const [materi, setMateri] = useState<Materi[]>([]);
  const [source, setSource] = useState("fallback");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Materi | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/materi", { cache: "no-store" });
      const result = await readJson<ApiListResponse<Materi>>(response);
      setMateri(result.data);
      setSource(result.source ?? "supabase");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat materi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(editing ? "Memperbarui materi..." : "Menyimpan materi...");
    const formData = new FormData(form);
    const payload = {
      judul: String(formData.get("judul") ?? ""),
      tipe: String(formData.get("tipe") ?? ""),
      content_body: String(formData.get("content_body") ?? ""),
      file_url: String(formData.get("file_url") ?? ""),
      image_url: String(formData.get("image_url") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      gradient: String(formData.get("gradient") ?? ""),
      reading_time: String(formData.get("reading_time") ?? ""),
      tag: String(formData.get("tag") ?? ""),
      date: String(formData.get("date") ?? ""),
      author_name: String(formData.get("author_name") ?? ""),
    };

    try {
      if (editing) {
        await readJson(await fetch("/api/materi", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: editing.id }) }));
        setEditing(null);
        setMessage("Materi berhasil diperbarui.");
      } else {
        await readJson(await fetch("/api/materi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }));
        form.reset();
        setMessage("Materi berhasil ditambahkan.");
      }
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan materi.");
    }
  }

  async function deleteMateri(id: string) {
    if (!confirm("Hapus materi ini?")) return;
    setMessage("Menghapus materi...");
    try {
      await readJson(await fetch("/api/materi", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }));
      setMessage("Materi berhasil dihapus.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus materi.");
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Materi & Konten</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-emerald-950">{editing ? "Edit Materi" : "Tambah Materi"}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{source}</span>
          <button onClick={loadData} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-cream px-4 py-2 text-sm font-bold text-emerald-950 transition hover:border-gold">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[1.5rem] bg-cream p-5 ring-1 ring-emerald-900/10">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="judul" required defaultValue={editing?.judul ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Judul" />
          <select name="tipe" required className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" defaultValue={editing?.tipe ?? ""}>
            <option value="" disabled>Pilih tipe</option>
            <option value="Artikel">Artikel</option>
            <option value="Materi">Materi</option>
            <option value="Jadwal">Jadwal</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input name="slug" defaultValue={editing?.slug ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Slug (untuk Artikel)" />
          <input name="tag" defaultValue={editing?.tag ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Tag (untuk Artikel)" />
          <input name="reading_time" defaultValue={editing?.reading_time ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Waktu baca (contoh: 5 menit)" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input name="date" defaultValue={editing?.date ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Tanggal tampil (contoh: 14 Mei 2026)" />
          <input name="author_name" defaultValue={editing?.author_name ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Nama penulis" />
          <input name="gradient" defaultValue={editing?.gradient ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Gradient (contoh: from-emerald-950 to-emerald-700)" />
        </div>
        <input name="image_url" defaultValue={editing?.image_url ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="URL thumbnail / cover gambar (opsional)" />
        {(editing?.image_url) ? (
          <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-emerald-950/60">Preview thumbnail:</p>
            <img
              src={toDirectImageUrl(editing.image_url)!}
              alt="Preview"
              className="h-32 w-full rounded-xl object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x200/emerald-900/gold?text=Gambar+gagal+dimuat"; }}
            />
          </div>
        ) : null}
        <input name="file_url" defaultValue={editing?.file_url ?? ""} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="URL file lampiran PDF/DOC (opsional)" />
        <textarea name="excerpt" rows={2} defaultValue={editing?.excerpt ?? ""} className="resize-none rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Ringkasan singkat (untuk Artikel)" />
        <textarea name="content_body" rows={4} defaultValue={editing?.content_body ?? ""} className="resize-none rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold" placeholder="Isi konten lengkap..." />
        <div className="flex gap-3">
          <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
            {editing ? <Pencil className="h-4 w-4" /> : <BookOpenText className="h-4 w-4" />} {editing ? "Update" : "Simpan"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 text-sm font-bold text-emerald-950 transition hover:border-gold">
              <X className="h-4 w-4" /> Batal
            </button>
          ) : null}
        </div>
      </form>

      {message ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold text-emerald-950/70">{message}</p> : null}

      <div className="mt-6 grid gap-3">
        {materi.length === 0 ? (
          <p className="rounded-2xl bg-cream p-4 text-center text-sm text-emerald-950/60 ring-1 ring-emerald-900/10">Belum ada data materi.</p>
        ) : (
          materi.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl bg-cream p-4 ring-1 ring-emerald-900/10">
              <div className="flex min-w-0 gap-4">
                {isImageUrl(item.image_url) ? (
                  <img src={toDirectImageUrl(item.image_url)!} alt={item.judul} className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-emerald-900/10" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                ) : null}
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="truncate font-bold text-emerald-950">{item.judul}</p>
                    <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{item.tipe}</span>
                  </div>
                  <p className="mt-1 text-sm text-emerald-950/60">{formatDate(item.created_at)} {item.file_url ? `· ${item.file_url}` : ""}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing(item)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-emerald-900 transition hover:bg-gold/25" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteMateri(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Hapus"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
