import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ data: [], source: "unconfigured" });
  }
  const { data, error } = await supabase.from("materi").select("*").order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ data: [], source: "error", message: error.message });
  }
  console.log("[public/materi] rows returned:", data?.length ?? 0);
  return NextResponse.json({ data: data ?? [], source: "supabase" });
}
