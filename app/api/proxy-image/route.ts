import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ message: "URL parameter wajib diisi." }, { status: 400 });
  }

  // Only allow Google Drive URLs for security
  if (!imageUrl.includes("googleusercontent.com") && !imageUrl.includes("drive.google.com")) {
    return NextResponse.json({ message: "Hanya URL Google Drive yang diizinkan." }, { status: 403 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        // Spoof a browser user-agent to avoid blocking
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: `Gagal mengambil gambar: ${response.status}` }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ message: "Gagal mengambil gambar dari server." }, { status: 502 });
  }
}
