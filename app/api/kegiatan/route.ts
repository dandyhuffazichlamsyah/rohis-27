import { NextResponse } from "next/server";
import { fallbackKegiatan } from "@/lib/admin-data";
import { createSupabaseAdminClient } from "@/lib/supabase";

type KegiatanPayload = {
  nama_kegiatan?: unknown;
  jenis?: unknown;
  tanggal?: unknown;
  lokasi?: unknown;
  deskripsi?: unknown;
};

const validJenis = new Set(["Kajian", "Sosial", "Shalat"]);

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: fallbackKegiatan, source: "fallback" });
  }

  const { data, error } = await supabase.from("kegiatan").select("*").order("tanggal", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message, data: fallbackKegiatan, source: "fallback" }, { status: 200 });
  }

  return NextResponse.json({ data, source: "supabase" });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: KegiatanPayload & { id?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const nama_kegiatan = typeof payload.nama_kegiatan === "string" ? payload.nama_kegiatan.trim() : "";
  const jenis = typeof payload.jenis === "string" ? payload.jenis.trim() : "";
  const tanggal = typeof payload.tanggal === "string" ? payload.tanggal.trim() : "";
  const lokasi = typeof payload.lokasi === "string" ? payload.lokasi.trim() : "";
  const deskripsi = typeof payload.deskripsi === "string" ? payload.deskripsi.trim() : null;

  if (!id) {
    return NextResponse.json({ message: "ID kegiatan wajib diisi." }, { status: 400 });
  }

  if (!nama_kegiatan || !validJenis.has(jenis) || !tanggal || !lokasi) {
    return NextResponse.json({ message: "Nama kegiatan, jenis valid, tanggal, dan lokasi wajib diisi." }, { status: 400 });
  }

  const parsedDate = new Date(tanggal);

  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Tanggal tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("kegiatan")
    .update({ nama_kegiatan, jenis: jenis as "Kajian" | "Sosial" | "Shalat", tanggal: parsedDate.toISOString(), lokasi, deskripsi })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: { id?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id.trim() : "";

  if (!id) {
    return NextResponse.json({ message: "ID kegiatan wajib diisi." }, { status: 400 });
  }

  const { error } = await supabase.from("kegiatan").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Kegiatan berhasil dihapus." });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi. Isi SUPABASE_SERVICE_ROLE_KEY untuk menambah data." }, { status: 503 });
  }

  let payload: KegiatanPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const nama_kegiatan = typeof payload.nama_kegiatan === "string" ? payload.nama_kegiatan.trim() : "";
  const jenis = typeof payload.jenis === "string" ? payload.jenis.trim() : "";
  const tanggal = typeof payload.tanggal === "string" ? payload.tanggal.trim() : "";
  const lokasi = typeof payload.lokasi === "string" ? payload.lokasi.trim() : "";
  const deskripsi = typeof payload.deskripsi === "string" ? payload.deskripsi.trim() : null;

  if (!nama_kegiatan || !validJenis.has(jenis) || !tanggal || !lokasi) {
    return NextResponse.json({ message: "Nama kegiatan, jenis valid, tanggal, dan lokasi wajib diisi." }, { status: 400 });
  }

  const parsedDate = new Date(tanggal);

  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Tanggal tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("kegiatan")
    .insert({ nama_kegiatan, jenis: jenis as "Kajian" | "Sosial" | "Shalat", tanggal: parsedDate.toISOString(), lokasi, deskripsi })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
