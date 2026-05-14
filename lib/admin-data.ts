import type { Database } from "@/lib/database.types";
import { createSupabaseAdminClient } from "@/lib/supabase";

type Anggota = Database["public"]["Tables"]["anggota"]["Row"];
type Kegiatan = Database["public"]["Tables"]["kegiatan"]["Row"];
type Materi = Database["public"]["Tables"]["materi"]["Row"];

export const fallbackAnggota: Anggota[] = [
  { id: "demo-1", nama: "Ahmad Fauzan", kelas: "XI IPA", jabatan: "Ketua Rohis", periode_kepengurusan: "2025/2026", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "demo-2", nama: "Naila Zahra", kelas: "XI IPS", jabatan: "Wakil Ketua", periode_kepengurusan: "2025/2026", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "demo-3", nama: "Salsabila Putri", kelas: "XI IPA", jabatan: "Sekretaris", periode_kepengurusan: "2025/2026", created_at: "2026-01-01T00:00:00.000Z" },
];

export const fallbackKegiatan: Kegiatan[] = [
  { id: "event-1", nama_kegiatan: "Mentoring Pekanan", jenis: "Kajian", tanggal: "2026-05-15T13:00:00.000Z", lokasi: "Masjid SMAN 27", deskripsi: "Pembinaan rutin pekanan bersama mentor." },
  { id: "event-2", nama_kegiatan: "Jumat Berkah", jenis: "Sosial", tanggal: "2026-05-22T00:30:00.000Z", lokasi: "Lingkungan sekolah", deskripsi: "Aksi berbagi makanan dan infak siswa." },
  { id: "event-3", nama_kegiatan: "Sholat Dhuha Bersama", jenis: "Shalat", tanggal: "2026-05-29T00:00:00.000Z", lokasi: "Mushola sekolah", deskripsi: "Pembiasaan ibadah sunnah bersama." },
];

export const fallbackMateri: Materi[] = [
  { id: "materi-1", judul: "Adab Menuntut Ilmu", tipe: "Materi", file_url: null, content_body: "Ringkasan materi mentoring tentang adab pelajar muslim.", author_id: null, created_at: "2026-05-01T00:00:00.000Z", slug: null, excerpt: null, gradient: null, reading_time: null, tag: null, date: null, author_name: null, image_url: null },
  { id: "materi-2", judul: "Jadwal Kajian Bulanan", tipe: "Jadwal", file_url: null, content_body: "Agenda kajian tematik setiap bulan.", author_id: null, created_at: "2026-05-03T00:00:00.000Z", slug: null, excerpt: null, gradient: null, reading_time: null, tag: null, date: null, author_name: null, image_url: null },
];

export async function getAdminDashboardData() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      anggota: fallbackAnggota,
      kegiatan: fallbackKegiatan,
      materi: fallbackMateri,
      absensiCount: 0,
      source: "fallback" as const,
    };
  }

  const [anggotaResult, kegiatanResult, materiResult, absensiResult] = await Promise.all([
    supabase.from("anggota").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("kegiatan").select("*").order("tanggal", { ascending: true }).limit(8),
    supabase.from("materi").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("absensi").select("id", { count: "exact", head: true }),
  ]);

  return {
    anggota: anggotaResult.data?.length ? anggotaResult.data : fallbackAnggota,
    kegiatan: kegiatanResult.data?.length ? kegiatanResult.data : fallbackKegiatan,
    materi: materiResult.data?.length ? materiResult.data : fallbackMateri,
    absensiCount: absensiResult.count ?? 0,
    source: anggotaResult.error || kegiatanResult.error || materiResult.error ? "fallback" as const : "supabase" as const,
  };
}
