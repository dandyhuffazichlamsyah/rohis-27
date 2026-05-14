import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Rohis SMAN 27 untuk pertanyaan, kerja sama, atau informasi kegiatan. Tersedia form kontak dan media sosial.",
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
