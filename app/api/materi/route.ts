import { NextResponse } from "next/server";
import { fallbackMateri } from "@/lib/admin-data";
import { createSupabaseAdminClient } from "@/lib/supabase";

type MateriPayload = {
  judul?: unknown;
  tipe?: unknown;
  file_url?: unknown;
  content_body?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  gradient?: unknown;
  reading_time?: unknown;
  tag?: unknown;
  date?: unknown;
  author_name?: unknown;
  image_url?: unknown;
};

const validTipe = new Set(["Artikel", "Materi", "Jadwal"]);

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: fallbackMateri, source: "fallback" });
  }

  const { data, error } = await supabase.from("materi").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message, data: fallbackMateri, source: "fallback" }, { status: 200 });
  }

  return NextResponse.json({ data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: MateriPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const judul = typeof payload.judul === "string" ? payload.judul.trim() : "";
  const tipe = typeof payload.tipe === "string" ? payload.tipe.trim() : "";
  const file_url = typeof payload.file_url === "string" ? payload.file_url.trim() || null : null;
  const content_body = typeof payload.content_body === "string" ? payload.content_body.trim() || null : null;
  const slug = typeof payload.slug === "string" ? payload.slug.trim() || null : null;
  const excerpt = typeof payload.excerpt === "string" ? payload.excerpt.trim() || null : null;
  const gradient = typeof payload.gradient === "string" ? payload.gradient.trim() || null : null;
  const reading_time = typeof payload.reading_time === "string" ? payload.reading_time.trim() || null : null;
  const tag = typeof payload.tag === "string" ? payload.tag.trim() || null : null;
  const date = typeof payload.date === "string" ? payload.date.trim() || null : null;
  const author_name = typeof payload.author_name === "string" ? payload.author_name.trim() || null : null;
  const image_url = typeof payload.image_url === "string" ? payload.image_url.trim() || null : null;

  if (!judul || !validTipe.has(tipe)) {
    return NextResponse.json({ message: "Judul dan tipe valid wajib diisi." }, { status: 400 });
  }

  const insertData: Record<string, unknown> = { judul, tipe: tipe as "Artikel" | "Materi" | "Jadwal", file_url, content_body };
  if (slug) insertData.slug = slug;
  if (excerpt) insertData.excerpt = excerpt;
  if (gradient) insertData.gradient = gradient;
  if (reading_time) insertData.reading_time = reading_time;
  if (tag) insertData.tag = tag;
  if (date) insertData.date = date;
  if (author_name) insertData.author_name = author_name;
  if (image_url) insertData.image_url = image_url;

  const { data, error } = await supabase
    .from("materi")
    .insert(insertData as any)
    .select("*")
    .single();

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

  let payload: MateriPayload & { id?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const judul = typeof payload.judul === "string" ? payload.judul.trim() : "";
  const tipe = typeof payload.tipe === "string" ? payload.tipe.trim() : "";
  const file_url = typeof payload.file_url === "string" ? payload.file_url.trim() || null : null;
  const content_body = typeof payload.content_body === "string" ? payload.content_body.trim() || null : null;
  const slug = typeof payload.slug === "string" ? payload.slug.trim() || null : null;
  const excerpt = typeof payload.excerpt === "string" ? payload.excerpt.trim() || null : null;
  const gradient = typeof payload.gradient === "string" ? payload.gradient.trim() || null : null;
  const reading_time = typeof payload.reading_time === "string" ? payload.reading_time.trim() || null : null;
  const tag = typeof payload.tag === "string" ? payload.tag.trim() || null : null;
  const date = typeof payload.date === "string" ? payload.date.trim() || null : null;
  const author_name = typeof payload.author_name === "string" ? payload.author_name.trim() || null : null;
  const image_url = typeof payload.image_url === "string" ? payload.image_url.trim() || null : null;

  if (!id || !judul || !validTipe.has(tipe)) {
    return NextResponse.json({ message: "ID, judul, dan tipe valid wajib diisi." }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { judul, tipe: tipe as "Artikel" | "Materi" | "Jadwal", file_url, content_body };
  if (slug) updateData.slug = slug;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (gradient) updateData.gradient = gradient;
  if (reading_time) updateData.reading_time = reading_time;
  if (tag) updateData.tag = tag;
  if (date) updateData.date = date;
  if (author_name !== undefined) updateData.author_name = author_name;
  if (image_url !== undefined) updateData.image_url = image_url;

  const { data, error } = await supabase
    .from("materi")
    .update(updateData as any)
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
    return NextResponse.json({ message: "ID materi wajib diisi." }, { status: 400 });
  }

  const { error } = await supabase.from("materi").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Materi berhasil dihapus." });
}
