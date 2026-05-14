import { BookOpenText, CalendarDays, ClipboardCheck, Database, ImageIcon, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import { AbsensiPanel } from "@/components/absensi-panel";
import { AdminCrudPanel } from "@/components/admin-crud-panel";
import { GalleryManager } from "@/components/gallery-manager";
import { MateriPanel } from "@/components/materi-panel";
import { PageHero } from "@/components/page-hero";
import { getAdminDashboardData } from "@/lib/admin-data";

export default async function AdminPage() {
  const { anggota, kegiatan, materi, absensiCount, source } = await getAdminDashboardData();
  const stats = [
    { label: "Anggota", value: anggota.length, icon: UsersRound },
    { label: "Kegiatan", value: kegiatan.length, icon: CalendarDays },
    { label: "Materi", value: materi.length, icon: BookOpenText },
    { label: "Absensi", value: absensiCount, icon: ClipboardCheck },
  ];

  return (
    <div className="bg-cream">
      <PageHero eyebrow="Dashboard Admin" title="Manajemen Data Rohis" description="Pantau data anggota, kegiatan, dan materi Rohis. Dashboard ini siap tersambung ke Supabase tanpa mengganggu tampilan publik." />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950 text-gold"><Database className="h-5 w-5" /></span>
              <div>
                <p className="font-bold text-emerald-950">Sumber Data</p>
                <p className="text-sm text-emerald-950/60">{source === "supabase" ? "Terhubung ke Supabase" : "Menggunakan data demo karena Supabase belum dikonfigurasi"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-bold text-emerald-900"><ShieldCheck className="h-4 w-4" /> Vercel Free Tier Ready</span>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-bold text-emerald-950 transition hover:border-gold">
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </form>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="rounded-[2rem] bg-emerald-950 p-6 text-white shadow-glow">
                  <Icon className="h-8 w-8 text-gold" />
                  <p className="mt-6 text-4xl font-black">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-emerald-50/60">{stat.label}</p>
                </article>
              );
            })}
          </div>

          <AdminCrudPanel />

          <GalleryManager />

          <MateriPanel />

          <AbsensiPanel />
        </div>
      </section>
    </div>
  );
}
