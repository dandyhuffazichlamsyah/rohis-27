import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: [], source: "unconfigured" });
  }

  const { data, error } = await supabase
    .from("kegiatan")
    .select("*")
    .order("tanggal", { ascending: true });

  if (error) {
    console.error("[public/kegiatan] Supabase error:", error.message);
    return NextResponse.json({ data: [], source: "error", message: error.message });
  }

  console.log("[public/kegiatan] rows returned:", data?.length ?? 0);
  return NextResponse.json({ data: data ?? [], source: "supabase" });
}
