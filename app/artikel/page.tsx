"use client";

import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { articles as fallbackArticles } from "@/lib/content";
import type { Database } from "@/lib/database.types";

type Materi = Database["public"]["Tables"]["materi"]["Row"];

export default function ArtikelPage() {
  const [artikel, setArtikel] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/materi", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data?.length) {
          setArtikel(result.data.filter((m: Materi) => m.tipe === "Artikel"));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const displayArticles = artikel.length > 0 ? artikel : fallbackArticles.map((a) => ({
    id: a.slug,
    slug: a.slug,
    judul: a.title,
    tag: a.tag,
    date: a.date,
    author_name: a.author,
    excerpt: a.excerpt,
    gradient: a.gradient,
    reading_time: a.readingTime,
    content_body: a.content.join("\n\n"),
    tipe: "Artikel" as const,
    file_url: null,
    author_id: null,
    created_at: "",
  }));

  return (
    <div className="bg-cream">
      <PageHero eyebrow="Artikel Islami" title="Majalah Digital Rohis" description="Bacaan ringan dan relevan untuk memperkaya wawasan Islam, motivasi ibadah, serta inspirasi kehidupan pelajar." />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {loading ? (
            <p className="col-span-full text-center text-sm text-emerald-950/60">Memuat artikel...</p>
          ) : (
            displayArticles.map((article, index) => (
              <article key={article.id} className={`overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 shadow-sm ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]" : ""}`}>
                <div className={`min-h-64 bg-gradient-to-br ${article.gradient ?? "from-emerald-950 to-emerald-700"} p-6 text-white`}>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">{article.tag ?? article.tipe}</span>
                  <h2 className="mt-20 max-w-xl font-display text-4xl font-bold">{article.judul}</h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-950/55">
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> {article.date ?? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(article.created_at))}</span>
                    <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-gold" /> {article.author_name ?? "Tim Rohis"}</span>
                  </div>
                  <p className="mt-5 leading-7 text-emerald-950/68">{article.excerpt ?? article.content_body?.slice(0, 120) + "..."}</p>
                  <Link href={`/artikel/${article.slug ?? article.id}`} className="mt-6 inline-flex rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">Baca Artikel</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
