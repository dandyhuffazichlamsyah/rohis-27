import type { Metadata } from "next";
import { BookHeart, Compass, HeartHandshake, Lightbulb, Milestone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Tentang Rohis",
  description: "Mengenal Rohis SMAN 27 Jakarta, visi-misi, dan perjalanan Rohani Islam yang bertumbuh dalam ilmu, adab, dan ukhuwah."
};

const timeline = [
  { year: "Awal Berdiri", title: "Ruang Pembinaan Siswa Muslim", description: "Rohis hadir sebagai wadah belajar agama, memperkuat ibadah, dan membangun ukhuwah di lingkungan sekolah." },
  { year: "Berkembang", title: "Program Mentoring & Kajian", description: "Kegiatan rutin mulai tersusun melalui mentoring pekanan, kajian tematik, dan kolaborasi bersama guru pembina." },
  { year: "Kini", title: "Dakwah Kreatif dan Modern", description: "Rohis SMAN 27 Jakarta bergerak dengan pendekatan digital, sosial, dan literasi Islami yang relevan untuk pelajar." },
];

const missions = [
  { title: "Menguatkan Akidah", description: "Membina pemahaman Islam yang lurus, seimbang, dan mudah diamalkan.", icon: ShieldCheck },
  { title: "Menumbuhkan Adab", description: "Membiasakan akhlak mulia dalam pergaulan sekolah dan masyarakat.", icon: HeartHandshake },
  { title: "Menghidupkan Literasi", description: "Mendorong budaya membaca, menulis, berdiskusi, dan berkarya Islami.", icon: BookHeart },
  { title: "Melayani Umat", description: "Mengadakan program sosial sebagai latihan kepedulian dan tanggung jawab.", icon: Lightbulb },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <PageHero eyebrow="Tentang Rohis" title="Mengenal Rohis SMAN 27 Jakarta" description="Rohis adalah rumah bertumbuh bagi siswa muslim untuk belajar Islam, mempererat ukhuwah, dan berkontribusi positif di sekolah." />

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-emerald-950 p-8 text-white shadow-glow">
            <Compass className="h-10 w-10 text-gold" />
            <h2 className="mt-6 font-display text-4xl font-bold">Visi</h2>
            <p className="mt-4 leading-8 text-emerald-50/75">Menjadi organisasi dakwah sekolah yang membentuk pribadi muslim berilmu, beradab, berprestasi, dan bermanfaat.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {missions.map((mission) => {
              const Icon = mission.icon;
              return (
                <article key={mission.title} className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
                  <Icon className="h-8 w-8 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-bold text-emerald-950">{mission.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-emerald-950/65">{mission.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Timeline</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-emerald-950">Perjalanan Rohis</h2>
          </div>
          <div className="relative grid gap-6">
            {timeline.map((item) => (
              <article key={item.title} className="grid gap-4 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm md:grid-cols-[180px_1fr]">
                <div className="flex items-center gap-3 font-bold text-emerald-900"><Milestone className="h-5 w-5 text-gold" /> {item.year}</div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-emerald-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/65">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <blockquote className="mx-auto max-w-4xl rounded-[2rem] border border-gold/25 bg-white/80 p-8 text-center shadow-sm">
          <p className="font-display text-3xl font-bold leading-relaxed text-emerald-950">“Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.”</p>
          <p className="mt-3 text-sm font-semibold text-emerald-800/70">HR. Ahmad</p>
        </blockquote>
      </section>
    </div>
  );
}
