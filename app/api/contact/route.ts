import { NextResponse } from "next/server";

type ContactPayload = {
  nama?: unknown;
  email?: unknown;
  pesan?: unknown;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Format pesan tidak valid." }, { status: 400 });
  }

  const nama = typeof payload.nama === "string" ? payload.nama.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const pesan = typeof payload.pesan === "string" ? payload.pesan.trim() : "";

  if (nama.length < 3) {
    return NextResponse.json({ message: "Nama minimal 3 karakter." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Email tidak valid." }, { status: 400 });
  }

  if (pesan.length < 10) {
    return NextResponse.json({ message: "Pesan minimal 10 karakter." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Pesan berhasil diterima. Tim Rohis akan menghubungi Anda kembali.",
    data: {
      nama,
      email,
      receivedAt: new Date().toISOString(),
    },
  });
}
