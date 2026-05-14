# Rohis SMAN 27

Website Rohis SMAN 27 berbasis Next.js App Router, Tailwind CSS, dan siap dikembangkan untuk integrasi Supabase serta deployment Vercel.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Jika dev server mengalami error cache `.next`, jalankan:

```bash
npm run dev:clean
```

## Konfigurasi Supabase

Salin `.env.example` menjadi `.env.local`, lalu isi:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Jalankan SQL di `supabase/schema.sql` pada SQL Editor Supabase. Jika env belum diisi, dashboard admin tetap tampil memakai data demo.

## Struktur awal

- `app/layout.tsx`: Global layout, metadata, font, navbar, footer.
- `app/page.tsx`: Homepage dengan hero, jadwal sholat, countdown event, dan quick links.
- `app/admin/page.tsx`: Dashboard admin untuk ringkasan anggota, kegiatan, dan materi.
- `app/api/anggota/route.ts`: API route untuk membaca dan menambah data anggota via Supabase.
- `app/api/kegiatan/route.ts`: API route untuk membaca dan menambah data kegiatan via Supabase.
- `app/about/page.tsx`: Halaman profil Rohis, visi-misi, timeline, dan quote inspiratif.
- `app/program/page.tsx`: Halaman program dengan filter kategori mingguan, bulanan, dan tahunan.
- `app/artikel/page.tsx`: Layout majalah untuk artikel Islami.
- `app/artikel/[slug]/page.tsx`: Detail artikel statis berbasis slug.
- `app/galeri/page.tsx`: Masonry gallery dengan lightbox.
- `app/pengurus/page.tsx`: Struktur pengurus dan divisi Rohis.
- `app/kontak/page.tsx`: Form kontak, info sosial media, dan placeholder peta.
- `app/api/contact/route.ts`: API route serverless untuk validasi submit form kontak.
- `lib/admin-data.ts`: Fetch data dashboard dari Supabase dengan fallback demo.
- `lib/database.types.ts`: TypeScript database types untuk tabel Supabase.
- `lib/supabase.ts`: Helper Supabase public/admin client.
- `lib/content.ts`: Data artikel terpusat untuk daftar dan halaman detail.
- `components/prayer-times-widget.tsx`: Widget jadwal sholat Jakarta via Aladhan API.
- `components/event-countdown.tsx`: Countdown event Rohis berikutnya.
- `components/page-hero.tsx`: Header halaman reusable.
- `components/program-filter.tsx`: Komponen filter program berbasis tab.
- `components/gallery-lightbox.tsx`: Komponen galeri interaktif.
- `components/contact-form.tsx`: Form kontak client-side dengan status submit.
- `components/admin-crud-panel.tsx`: Panel admin client-side untuk tambah anggota dan kegiatan melalui API route.
- `supabase/schema.sql`: Skema database awal untuk anggota, kegiatan, absensi, dan materi.

## Catatan Admin

Panel CRUD di `/admin` dapat membaca data demo tanpa env Supabase. Untuk menyimpan data sungguhan, konfigurasi `SUPABASE_SERVICE_ROLE_KEY` di `.env.local` atau Vercel Environment Variables.
