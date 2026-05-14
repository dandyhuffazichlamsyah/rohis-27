import type { Metadata } from "next";
import { Amiri, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: { default: "Rohis SMAN 27 Jakarta", template: "%s | Rohis SMAN 27 Jakarta" },
  description: "Website resmi Rohis SMAN 27 Jakarta untuk program, artikel islami, galeri kegiatan, dan informasi kepengurusan.",
  metadataBase: new URL("https://rohis-sman27.vercel.app"),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Rohis SMAN 27 Jakarta",
    title: "Rohis SMAN 27 Jakarta",
    description: "Website resmi Rohis SMAN 27 Jakarta untuk program, artikel islami, galeri kegiatan, dan informasi kepengurusan.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rohis SMAN 27 Jakarta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohis SMAN 27 Jakarta",
    description: "Website resmi Rohis SMAN 27 Jakarta untuk program, artikel islami, galeri kegiatan, dan informasi kepengurusan.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${amiri.variable} font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
