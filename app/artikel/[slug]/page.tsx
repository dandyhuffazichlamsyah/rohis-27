"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { articles as fallbackArticles } from "@/lib/content";
import type { Database } from "@/lib/database.types";

type Materi = Database["public"]["Tables"]["materi"]["Row"];

type ArticleDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Materi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/materi", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          const found = result.data.find((a: Materi) => a.slug === params.slug && a.tipe === "Artikel");
          if (found) setArticle(found);
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const fallback = fallbackArticles.find((a) => a.slug === params.slug);
  const display = article ?? (fallback ? {
    id: fallback.slug,
    slug: fallback.slug,
    judul: fallback.title,
    tag: fallback.tag,
    date: fallback.date,
    author_name: fallback.author,
    excerpt: fallback.excerpt,
    gradient: fallback.gradient,
    reading_time: fallback.readingTime,
    content_body: fallback.content.join("\n\n"),
    tipe: "Artikel" as const,
    file_url: null,
    author_id: null,
    created_at: "",
  } : null);

  useEffect(() => {
    if (display) document.title = display.judul;
  }, [display]);

  if (loading) {
    return (
      <div className="bg-cream px-4 py-24 text-center">
        <p className="text-sm text-emerald-950/60">Memuat artikel...</p>
      </div>
    );
  }

  if (!display) {
    return (
      <div className="bg-cream px-4 py-24 text-center">
        <p className="text-lg font-bold text-emerald-950">Artikel tidak ditemukan</p>
        <Link href="/artikel" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>
    );
  }

  const paragraphs = (display.content_body ?? "").split(/\n\n+/);

  return (
    <article className="bg-cream">
      <section className={`relative isolate overflow-hidden bg-gradient-to-br ${display.gradient ?? "from-emerald-950 to-emerald-700"} px-4 py-20 text-white sm:px-6 lg:px-8`}>
        <div className="absolute inset-0 -z-10 bg-islamic-pattern geometric-mask opacity-25" />
        <div className="mx-auto max-w-4xl">
          <Link href="/artikel" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel
          </Link>
          <div className="mt-10">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">{display.tag ?? display.tipe}</span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl">{display.judul}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{display.excerpt ?? display.content_body?.slice(0, 200)}</p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-white/75">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> {display.date ?? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(display.created_at))}</span>
              <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-gold" /> {display.author_name ?? "Tim Rohis"}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-gold" /> {display.reading_time ?? "5 menit baca"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-900/10 bg-white/85 p-7 shadow-sm sm:p-10">
          <div className="space-y-6 text-lg leading-9 text-emerald-950/75">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
