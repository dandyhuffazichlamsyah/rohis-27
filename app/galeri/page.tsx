import type { Metadata } from "next";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Dokumentasi kegiatan Rohis SMAN 27: mentoring, kajian, PHBI, dan aksi sosial Islami di sekolah.",
};

export default function GaleriPage() {
  return (
    <div className="bg-cream">
      <PageHero eyebrow="Galeri Dokumentasi" title="Momen Ukhuwah dan Kegiatan Rohis" description="Kumpulan dokumentasi kegiatan Rohis SMAN 27, mulai dari mentoring, kajian, PHBI, hingga aksi sosial sekolah." />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GalleryLightbox />
        </div>
      </section>
    </div>
  );
}
