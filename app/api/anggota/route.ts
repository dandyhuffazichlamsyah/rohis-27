import { NextResponse } from "next/server";
import { fallbackAnggota } from "@/lib/admin-data";
import { createSupabaseAdminClient } from "@/lib/supabase";

type AnggotaPayload = {
  nama?: unknown;
  kelas?: unknown;
  jabatan?: unknown;
  periode_kepengurusan?: unknown;
};

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: fallbackAnggota, source: "fallback" });
  }

  const { data, error } = await supabase.from("anggota").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message, data: fallbackAnggota, source: "fallback" }, { status: 200 });
  }

  return NextResponse.json({ data, source: "supabase" });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi." }, { status: 503 });
  }

  let payload: AnggotaPayload & { id?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const nama = typeof payload.nama === "string" ? payload.nama.trim() : "";
  const kelas = typeof payload.kelas === "string" ? payload.kelas.trim() : "";
  const jabatan = typeof payload.jabatan === "string" ? payload.jabatan.trim() : null;
  const periode_kepengurusan = typeof payload.periode_kepengurusan === "string" ? payload.periode_kepengurusan.trim() : "";

  if (!id) {
    return NextResponse.json({ message: "ID anggota wajib diisi." }, { status: 400 });
  }

  if (!nama || !kelas || !periode_kepengurusan) {
    return NextResponse.json({ message: "Nama, kelas, dan periode kepengurusan wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("anggota")
    .update({ nama, kelas, jabatan, periode_kepengurusan })
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
    return NextResponse.json({ message: "ID anggota wajib diisi." }, { status: 400 });
  }

  const { error } = await supabase.from("anggota").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Anggota berhasil dihapus." });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase admin belum dikonfigurasi. Isi SUPABASE_SERVICE_ROLE_KEY untuk menambah data." }, { status: 503 });
  }

  let payload: AnggotaPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const nama = typeof payload.nama === "string" ? payload.nama.trim() : "";
  const kelas = typeof payload.kelas === "string" ? payload.kelas.trim() : "";
  const jabatan = typeof payload.jabatan === "string" ? payload.jabatan.trim() : null;
  const periode_kepengurusan = typeof payload.periode_kepengurusan === "string" ? payload.periode_kepengurusan.trim() : "";

  if (!nama || !kelas || !periode_kepengurusan) {
    return NextResponse.json({ message: "Nama, kelas, dan periode kepengurusan wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("anggota")
    .insert({ nama, kelas, jabatan, periode_kepengurusan })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
