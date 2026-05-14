"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function toDirectImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

type GaleriItem = {
  id: string;
  caption: string;
  image_url: string;
  created_at: string;
  nama_kegiatan?: string | null;
  tanggal?: string | null;
  deskripsi?: string | null;
};

const demoItems = [
  { id: "d1", caption: "Kajian Jumat", image_url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&h=600&fit=crop", created_at: "" },
  { id: "d2", caption: "Mentoring Pekanan", image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop", created_at: "" },
  { id: "d3", caption: "PHBI Maulid", image_url: "https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=800&h=600&fit=crop", created_at: "" },
  { id: "d4", caption: "Pesantren Kilat", image_url: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&h=600&fit=crop", created_at: "" },
  { id: "d5", caption: "Jumat Berkah", image_url: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&h=600&fit=crop", created_at: "" },
  { id: "d6", caption: "Mabit Rohis", image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop", created_at: "" },
];

export function GalleryLightbox() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GaleriItem | null>(null);
  const [hasRealData, setHasRealData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/galeri?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          setItems(result.data);
          setHasRealData(true);
        } else {
          setItems(demoItems);
          setHasRealData(false);
        }
      })
      .catch(() => {
        setItems(demoItems);
        setHasRealData(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-900/20 border-t-emerald-900" />
        <p className="mt-3 text-sm text-emerald-950/60">Memuat galeri...</p>
      </div>
    );
  }

  return (
    <>
      {!hasRealData && (
        <p className="mb-6 text-center text-xs text-emerald-950/60">Menampilkan galeri demo — tambahkan foto di admin untuk data real-time.</p>
      )}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" as const }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedItem(item)}
            className="group mb-5 w-full break-inside-avoid overflow-hidden rounded-[2rem] bg-cream text-left shadow-sm ring-1 ring-emerald-900/10"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={toDirectImageUrl(item.image_url)}
                alt={item.caption}
                className="h-full w-full object-cover transition group-hover:scale-105"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x600/emerald-900/gold?text=Gambar+tidak+tersedia"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-display text-2xl font-bold text-white">{item.caption}</h2>
                {item.nama_kegiatan && <p className="mt-1 text-sm font-semibold text-gold">{item.nama_kegiatan}</p>}
                <p className="mt-1 text-sm text-white/75">Klik untuk memperbesar.</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-emerald-950/85 p-4 backdrop-blur"
            role="dialog"
            aria-modal="true"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring" as const, stiffness: 300, damping: 25 }} className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-glow">
              <button onClick={() => setSelectedItem(null)} className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950/50 text-white ring-1 ring-white/20" aria-label="Tutup galeri">
                <X className="h-5 w-5" />
              </button>
              <div className="flex max-h-[75vh] w-full items-center justify-center overflow-hidden bg-emerald-950/5">
                <img
                  src={toDirectImageUrl(selectedItem.image_url)}
                  alt={selectedItem.caption}
                  className="max-h-[75vh] max-w-full object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/1200x800/emerald-900/gold?text=Gambar+tidak+tersedia"; }}
                />
              </div>
              <div className="bg-cream p-6">
                <h2 className="font-display text-2xl font-bold text-emerald-950">{selectedItem.caption}</h2>
                {selectedItem.nama_kegiatan && <p className="mt-1 text-sm font-bold text-emerald-800">{selectedItem.nama_kegiatan}</p>}
                {selectedItem.tanggal && (
                  <p className="mt-1 text-xs text-emerald-950/60">
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(selectedItem.tanggal))}
                  </p>
                )}
                {selectedItem.deskripsi && <p className="mt-3 text-sm leading-relaxed text-emerald-950/70">{selectedItem.deskripsi}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
