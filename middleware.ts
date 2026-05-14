import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public data APIs are open without auth
  if (pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api/anggota") || pathname.startsWith("/api/kegiatan") || pathname.startsWith("/api/absensi") || pathname.startsWith("/api/materi") || pathname.startsWith("/api/galeri");

  if (!isAdminRoute && !isApiRoute) {
    return NextResponse.next();
  }

  if (isAdminRoute && PUBLIC_ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Server auth belum dikonfigurasi." }, { status: 503 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const cookie = request.cookies.get("rohis_admin_session")?.value;
  if (!cookie) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Akses ditolak. Silakan login terlebih dahulu." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const valid = await verifySessionToken(cookie, secret);
  if (!valid) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Sesi tidak valid atau sudah habis." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/anggota", "/api/anggota/:path*", "/api/kegiatan", "/api/kegiatan/:path*", "/api/absensi", "/api/absensi/:path*", "/api/materi", "/api/materi/:path*", "/api/galeri", "/api/galeri/:path*", "/api/public/:path*"],
};
