import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProgramFilter } from "@/components/program-filter";

export const metadata: Metadata = {
  title: "Program Kegiatan",
  description: "Jelajahi program mentoring, kajian, PHBI, pesantren kilat, dan kegiatan sosial Islami Rohis SMAN 27.",
};

export default function ProgramPage() {
  return (
    <div className="bg-cream">
      <PageHero eyebrow="Program & Kegiatan" title="Kegiatan Rohis yang Terarah dan Menyenangkan" description="Temukan agenda pembinaan, kajian, sosial, dan kegiatan tahunan yang dirancang untuk membentuk karakter muslim pelajar." />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgramFilter />
        </div>
      </section>
    </div>
  );
}
