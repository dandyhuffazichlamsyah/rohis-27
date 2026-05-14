import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-cream px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-900/10 bg-white/80 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-emerald-950 text-gold">
          <SearchX className="h-9 w-9" />
        </div>
        <h1 className="mt-7 font-display text-5xl font-bold text-emerald-950">Halaman Tidak Ditemukan</h1>
        <p className="mt-4 leading-7 text-emerald-950/65">Maaf, halaman yang Anda cari belum tersedia atau alamatnya tidak sesuai.</p>
        <Link href="/" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800">
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
