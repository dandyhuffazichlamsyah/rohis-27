"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import type { Database } from "@/lib/database.types";

type Galeri = Database["public"]["Tables"]["galeri"]["Row"];

type ApiListResponse<T> = {
  data: T[];
  source?: string;
  message?: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? "Terjadi kesalahan pada server.");
  return result;
}

function toDirectImageUrl(url: string): string {
  if (!url) return url;
  // If it's a Google Drive or Google User Content URL, proxy through our API
  if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

type PhotoInput = { caption: string; url: string };

export function GalleryManager() {
  const [images, setImages] = useState<Galeri[]>([]);
  const [source, setSource] = useState("fallback");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Galeri | null>(null);
  const [photos, setPhotos] = useState<PhotoInput[]>([{ caption: "", url: "" }]);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/galeri", { cache: "no-store" });
      const result = await readJson<ApiListResponse<Galeri>>(response);
      setImages(result.data);
      setSource(result.source ?? "supabase");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat galeri.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function addPhotoInput() {
    setPhotos((prev) => [...prev, { caption: "", url: "" }]);
  }

  function removePhotoInput(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePhotoInput(index: number, field: keyof PhotoInput, value: string) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nama_kegiatan = String(formData.get("nama_kegiatan") ?? "");
    const tanggal = String(formData.get("tanggal") ?? "");
    const deskripsi = String(formData.get("deskripsi") ?? "");

    if (editing) {
      setMessage("Memperbarui foto...");
      try {
        await readJson(await fetch("/api/galeri", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            caption: photos[0].caption,
            image_url: photos[0].url,
            nama_kegiatan: nama_kegiatan || null,
            tanggal: tanggal || null,
            deskripsi: deskripsi || null,
          }),
        }));
        setEditing(null);
        setPhotos([{ caption: "", url: "" }]);
        form.reset();
        setMessage("Foto berhasil diperbarui.");
        await loadData();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal memperbarui foto.");
      }
      return;
    }

    const validPhotos = photos.filter((p) => p.caption.trim() && p.url.trim());
    if (validPhotos.length === 0) {
      setMessage("Tambahkan minimal satu foto dengan caption dan URL.");
      return;
    }

    setMessage(`Menyimpan ${validPhotos.length} foto...`);
    try {
      for (const photo of validPhotos) {
        await readJson(await fetch("/api/galeri", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caption: photo.caption,
            image_url: photo.url,
            nama_kegiatan: nama_kegiatan || null,
            tanggal: tanggal || null,
            deskripsi: deskripsi || null,
          }),
        }));
      }
      setPhotos([{ caption: "", url: "" }]);
      form.reset();
      setMessage(`${validPhotos.length} foto berhasil ditambahkan.`);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menambahkan foto.");
    }
  }

  function startEdit(img: Galeri) {
    setEditing(img);
    setPhotos([{ caption: img.caption, url: img.image_url }]);
  }

  function cancelEdit() {
    setEditing(null);
    setPhotos([{ caption: "", url: "" }]);
  }

  async function deleteImage(id: string) {
    if (!confirm("Hapus foto ini?")) return;
    setMessage("Menghapus foto...");
    try {
      await readJson(await fetch("/api/galeri", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }));
      setMessage("Foto berhasil dihapus.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus foto.");
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Galeri</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-emerald-950">{editing ? "Edit Dokumentasi" : "Tambah Dokumentasi Kegiatan"}</h2>
          <p className="mt-2 text-sm text-emerald-950/60">{editing ? "Perbarui detail foto kegiatan." : "Unggah banyak foto dari satu kegiatan sekaligus."}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-emerald-900">{source}</span>
          <button onClick={loadData} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-cream px-4 py-2 text-sm font-bold text-emerald-950 transition hover:border-gold">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <form key={editing?.id ?? "new"} onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[1.5rem] bg-cream p-5 ring-1 ring-emerald-900/10">
        <input
          name="nama_kegiatan"
          defaultValue={editing?.nama_kegiatan ?? ""}
          className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
          placeholder="Nama kegiatan"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="tanggal"
            type="date"
            defaultValue={editing?.tanggal ? new Date(editing.tanggal).toISOString().split("T")[0] : ""}
            className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
          />
          <input
            name="deskripsi"
            defaultValue={editing?.deskripsi ?? ""}
            className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
            placeholder="Deskripsi kegiatan"
          />
        </div>

        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <input
                value={photo.caption}
                onChange={(e) => updatePhotoInput(index, "caption", e.target.value)}
                required
                className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
                placeholder="Caption foto"
              />
              <input
                value={photo.url}
                onChange={(e) => updatePhotoInput(index, "url", e.target.value)}
                required
                className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 outline-none focus:border-gold"
                placeholder="URL gambar (https://...)"
              />
              {photos.length > 1 && !editing ? (
                <button type="button" onClick={() => removePhotoInput(index)} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/10 bg-white text-red-600 transition hover:bg-red-50">
                  <X className="h-4 w-4" />
                </button>
              ) : <div />}
            </div>
          ))}
        </div>

        {photos[0].url && (
          <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-emerald-950/60">Preview gambar:</p>
            <img
              src={toDirectImageUrl(photos[0].url)}
              alt="Preview"
              className="h-40 w-full rounded-xl object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x300/emerald-900/gold?text=Gambar+gagal+dimuat"; }}
            />
          </div>
        )}

        {!editing && (
          <button type="button" onClick={addPhotoInput} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:border-gold">
            <Plus className="h-4 w-4" /> Tambah Foto Lain
          </button>
        )}

        <div className="flex gap-3">
          <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
            {editing ? <Pencil className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />} {editing ? "Perbarui" : "Simpan Semua"}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 text-sm font-bold text-emerald-950 transition hover:border-gold">
              <X className="h-4 w-4" /> Batal
            </button>
          )}
        </div>
      </form>

      {message ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold text-emerald-950/70">{message}</p> : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <p className="col-span-full rounded-2xl bg-cream p-8 text-center text-sm text-emerald-950/60 ring-1 ring-emerald-900/10">Belum ada foto.</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-[1.5rem] bg-cream ring-1 ring-emerald-900/10">
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={toDirectImageUrl(img.image_url)}
                  alt={img.caption}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x400/emerald-900/gold?text=Gambar+tidak+tersedia"; }}
                />
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-bold text-emerald-950">{img.caption}</p>
                {img.nama_kegiatan && <p className="mt-1 text-xs font-semibold text-emerald-950/60">{img.nama_kegiatan}</p>}
                {img.tanggal && <p className="text-xs text-emerald-950/50">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(img.tanggal))}</p>}
                {img.deskripsi && <p className="mt-1 text-xs text-emerald-950/50 line-clamp-2">{img.deskripsi}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => startEdit(img)} className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-emerald-900 transition hover:bg-gold/25" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteImage(img.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Hapus"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
