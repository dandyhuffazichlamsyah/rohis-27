import { NextResponse } from "next/server";
import { createSessionToken, getCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!secret || !adminPassword) {
    return NextResponse.json({ message: "Autentikasi belum dikonfigurasi." }, { status: 503 });
  }

  let payload: { password?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 });
  }

  const password = typeof payload.password === "string" ? payload.password : "";

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
