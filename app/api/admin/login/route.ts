import { NextResponse } from "next/server";
import { createSessionToken, getCookieName } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!secret || !adminPassword) {
    return NextResponse.json({ message: "Autentikasi belum dikonfigurasi." }, { status: 503 });
  }

  // Rate limit: 5 attempts per IP per 15 minutes
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    const minutes = Math.ceil(rateLimit.retryAfterMs / 60000);
    return NextResponse.json(
      { message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.` },
      { status: 429 },
    );
  }

  let payload: { password?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const password = typeof payload.password === "string" ? payload.password : "";

  if (!password || password.length > 256) {
    return NextResponse.json({ message: "Password tidak valid." }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ message: "Password salah." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const response = NextResponse.json({ message: "Login berhasil." });
  response.cookies.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
