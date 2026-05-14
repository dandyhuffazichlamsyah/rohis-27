import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: [], source: "fallback" });
  }

  const { data, error } = await supabase
    .from("absensi")
    .select("*, anggota:anggota_id(nama, kelas), kegiatan:kegiatan_id(nama_kegiatan, tanggal)")
    .order("timestamp", { ascending: false })
    .limit(50);

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

  let payload: { kegiatan_id?: unknown; anggota_id?: unknown; status?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const kegiatan_id = typeof payload.kegiatan_id === "string" ? payload.kegiatan_id.trim() : "";
  const anggota_id = typeof payload.anggota_id === "string" ? payload.anggota_id.trim() : "";
  const status = typeof payload.status === "string" ? payload.status.trim() : "";
  const validStatus = new Set(["Hadir", "Izin", "Sakit", "Alpa"]);

  if (!kegiatan_id || !anggota_id || !validStatus.has(status)) {
    return NextResponse.json({ message: "Kegiatan, anggota, dan status wajib diisi dengan benar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("absensi")
    .insert({ kegiatan_id, anggota_id, status: status as "Hadir" | "Izin" | "Sakit" | "Alpa" })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
