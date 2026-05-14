create extension if not exists "pgcrypto";

create table if not exists anggota (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kelas text not null,
  jabatan text,
  periode_kepengurusan text not null,
  created_at timestamptz not null default now()
);

create table if not exists kegiatan (
  id uuid primary key default gen_random_uuid(),
  nama_kegiatan text not null,
  jenis text not null check (jenis in ('Kajian', 'Sosial', 'Shalat')),
  tanggal timestamptz not null,
  lokasi text not null,
  deskripsi text
);

create table if not exists absensi (
  id uuid primary key default gen_random_uuid(),
  kegiatan_id uuid not null references kegiatan(id) on delete cascade,
  anggota_id uuid not null references anggota(id) on delete cascade,
  status text not null check (status in ('Hadir', 'Izin', 'Sakit', 'Alpa')),
  timestamp timestamptz not null default now(),
  unique (kegiatan_id, anggota_id)
);

create table if not exists materi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  tipe text not null check (tipe in ('Artikel', 'Materi', 'Jadwal')),
  file_url text,
  content_body text,
  author_id uuid references anggota(id) on delete set null,
  created_at timestamptz not null default now(),
  check (file_url is not null or content_body is not null)
);

create table if not exists galeri (
  id uuid primary key default gen_random_uuid(),
  caption text not null,
  image_url text not null,
  nama_kegiatan text,
  tanggal timestamptz,
  deskripsi text,
  created_at timestamptz not null default now()
);

alter table materi
  add column if not exists slug text unique,
  add column if not exists excerpt text,
  add column if not exists gradient text default 'from-emerald-950 to-emerald-700',
  add column if not exists reading_time text default '5 menit baca',
  add column if not exists tag text,
  add column if not exists date text,
  add column if not exists author_name text,
  add column if not exists image_url text;

create index if not exists idx_kegiatan_tanggal on kegiatan(tanggal);
create index if not exists idx_absensi_kegiatan_id on absensi(kegiatan_id);
create index if not exists idx_absensi_anggota_id on absensi(anggota_id);
create index if not exists idx_materi_tipe on materi(tipe);
create index if not exists idx_galeri_created_at on galeri(created_at);
create index if not exists idx_materi_slug on materi(slug);
