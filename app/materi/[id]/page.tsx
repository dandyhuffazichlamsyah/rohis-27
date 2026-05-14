"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Download, UserRound } from "lucide-react";
import type { Database } from "@/lib/database.types";

function toDirectImageUrl(url: string | null): string | null {
  if (!url) return url;
  if (url.includes("drive.google.com") || url.includes("googleusercontent.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

type Materi = Database["public"]["Tables"]["materi"]["Row"];

type MateriDetailPageProps = {
  params: {
    id: string;
  };
};

export default function MateriDetailPage({ params }: MateriDetailPageProps) {
  const [item, setItem] = useState<Materi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/materi", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          const found = result.data.find((m: Materi) => m.id === params.id);
          if (found) setItem(found);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (item) document.title = item.judul;
  }, [item]);

  if (loading) {
    return (
      <div className="bg-cream px-4 py-24 text-center">
        <p className="text-sm text-emerald-950/60">Memuat...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-cream px-4 py-24 text-center">
        <p className="text-lg font-bold text-emerald-950">Konten tidak ditemukan</p>
        <Link href="/materi" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>
    );
  }

  const paragraphs = (item.content_body ?? "").split(/\n\n+/);

  return (
    <article className="bg-cream">
      <section className={`relative isolate overflow-hidden bg-gradient-to-br ${item.gradient ?? "from-emerald-950 to-emerald-700"} px-4 py-20 text-white sm:px-6 lg:px-8`}>
        <div className="absolute inset-0 -z-10 bg-islamic-pattern geometric-mask opacity-25" />
        <div className="mx-auto max-w-4xl">
          <Link href="/materi" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <div className="mt-10">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">{item.tag ?? item.tipe}</span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl">{item.judul}</h1>
            {item.excerpt ? <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{item.excerpt}</p> : null}
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-white/75">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> {item.date ?? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.created_at))}</span>
              <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-gold" /> {item.author_name ?? "Tim Rohis"}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-gold" /> {item.reading_time ?? "5 menit baca"}</span>
            </div>
          </div>
        </div>
      </section>

      {item.image_url ? (
        <section className="px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <img src={toDirectImageUrl(item.image_url)!} alt={item.judul} className="w-full rounded-[2rem] object-cover ring-1 ring-emerald-900/10 shadow-sm" style={{ maxHeight: "28rem" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
        </section>
      ) : null}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-900/10 bg-white/85 p-7 shadow-sm sm:p-10">
          <div className="space-y-6 text-lg leading-9 text-emerald-950/75">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {item.file_url ? (
            <div className="mt-8 border-t border-emerald-900/10 pt-8">
              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
                <Download className="h-4 w-4" /> Unduh File Lampiran
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}
