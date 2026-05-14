import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({
      data: [
        { id: "g1", caption: "Mentoring Pekanan", image_url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
        { id: "g2", caption: "Kajian Bersama", image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
        { id: "g3", caption: "Jumat Berkah", image_url: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
        { id: "g4", caption: "Pesantren Kilat", image_url: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
        { id: "g5", caption: "PHBI Maulid", image_url: "https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
        { id: "g6", caption: "Kegiatan Sosial", image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop", created_at: "2026-01-01T00:00:00.000Z" },
      ],
      source: "fallback",
    });
  }

  const { data, error } = await supabase.from("galeri").select("*").order("created_at", { ascending: false }).limit(20);

  if (error) {
    return NextResponse.json({ message: error.message, data: [], source: "fallback" }, { status: 200 });
  }

  return NextResponse.json({ data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: { caption?: unknown; image_url?: unknown; nama_kegiatan?: unknown; tanggal?: unknown; deskripsi?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const caption = typeof payload.caption === "string" ? payload.caption.trim() : "";
  const image_url = typeof payload.image_url === "string" ? payload.image_url.trim() : "";
  const nama_kegiatan = typeof payload.nama_kegiatan === "string" ? payload.nama_kegiatan.trim() : null;
  const tanggal = typeof payload.tanggal === "string" ? payload.tanggal.trim() : null;
  const deskripsi = typeof payload.deskripsi === "string" ? payload.deskripsi.trim() : null;

  if (!caption || !image_url) {
    return NextResponse.json({ message: "Caption dan URL gambar wajib diisi." }, { status: 400 });
  }

  const insertData: Record<string, unknown> = { caption, image_url };
  if (nama_kegiatan) insertData.nama_kegiatan = nama_kegiatan;
  if (tanggal) insertData.tanggal = tanggal;
  if (deskripsi) insertData.deskripsi = deskripsi;

  const { data, error } = await supabase.from("galeri").insert(insertData as any).select("*").single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  if (!id) {
    return NextResponse.json({ message: "ID gambar wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabase.from("galeri").update(payload as any).eq("id", id).select("*").single();

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
    return NextResponse.json({ message: "ID gambar wajib diisi." }, { status: 400 });
  }

  const { error } = await supabase.from("galeri").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Gambar berhasil dihapus." });
}
