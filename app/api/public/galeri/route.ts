import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ data: [], source: "unconfigured" });
  }

  const { data, error } = await supabase
    .from("galeri")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[public/galeri] Supabase error:", error.message);
    return NextResponse.json({ data: [], source: "error", message: error.message });
  }

  console.log("[public/galeri] rows returned:", data?.length ?? 0);
  return NextResponse.json({ data: data ?? [], source: "supabase" });
}
