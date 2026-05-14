export type Article = {
  slug: string;
  title: string;
  tag: "Akidah" | "Fiqih" | "Motivasi" | "Kisah Inspiratif";
  date: string;
  author: string;
  excerpt: string;
  gradient: string;
  readingTime: string;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "menjaga-semangat-ibadah-di-sekolah",
    title: "Menjaga Semangat Ibadah di Sekolah",
    tag: "Motivasi",
    date: "12 Mei 2026",
    author: "Tim Literasi Rohis",
    excerpt: "Tips sederhana agar sholat, tilawah, dan adab tetap terjaga di tengah kesibukan belajar.",
    gradient: "from-emerald-950 to-emerald-700",
    readingTime: "4 menit baca",
    content: [
      "Sekolah adalah tempat belajar, berteman, dan membangun masa depan. Di tengah aktivitas yang padat, seorang pelajar muslim tetap perlu menjaga hubungan dengan Allah melalui ibadah yang konsisten.",
      "Mulailah dari hal kecil seperti menjaga sholat tepat waktu, membawa mushaf atau aplikasi Al-Qur'an, serta memilih lingkungan pertemanan yang saling mengingatkan kepada kebaikan.",
      "Rohis hadir sebagai teman perjalanan agar suasana sekolah menjadi lebih dekat dengan nilai Islam, penuh adab, dan saling mendukung dalam kebaikan.",
    ],
  },
  {
    slug: "adab-menuntut-ilmu-bagi-pelajar",
    title: "Adab Menuntut Ilmu bagi Pelajar",
    tag: "Akidah",
    date: "8 Mei 2026",
    author: "Divisi Syiar",
    excerpt: "Ilmu yang berkah dimulai dari niat yang lurus, hormat kepada guru, dan konsisten beramal.",
    gradient: "from-gold to-amber-300",
    readingTime: "5 menit baca",
    content: [
      "Ilmu bukan hanya tentang nilai dan hafalan. Dalam Islam, ilmu adalah cahaya yang menuntun manusia untuk mengenal Allah dan memperbaiki amal.",
      "Adab menuntut ilmu dimulai dari meluruskan niat, menghormati guru, menjaga lisan, serta tidak sombong ketika mengetahui sesuatu lebih dulu.",
      "Pelajar yang beradab akan menjadikan ilmunya bermanfaat, bukan hanya untuk dirinya sendiri, tetapi juga untuk keluarga, sekolah, dan masyarakat.",
    ],
  },
  {
    slug: "fiqih-ringkas-sholat-berjamaah",
    title: "Fiqih Ringkas Sholat Berjamaah",
    tag: "Fiqih",
    date: "2 Mei 2026",
    author: "Mentor Rohis",
    excerpt: "Ringkasan hukum dan keutamaan sholat berjamaah yang penting dipahami oleh siswa.",
    gradient: "from-teal-900 to-emerald-500",
    readingTime: "6 menit baca",
    content: [
      "Sholat berjamaah memiliki kedudukan besar dalam Islam. Selain bernilai pahala lebih utama, berjamaah juga melatih kedisiplinan dan persaudaraan.",
      "Di sekolah, siswa dapat membiasakan diri untuk datang lebih awal ke mushola, merapikan shaf, mengikuti imam dengan tertib, dan menjaga ketenangan tempat ibadah.",
      "Kebiasaan berjamaah akan membentuk pribadi yang lebih disiplin, peduli, dan dekat dengan komunitas kebaikan.",
    ],
  },
  {
    slug: "kisah-pemuda-ashabul-kahfi",
    title: "Kisah Pemuda Ashabul Kahfi",
    tag: "Kisah Inspiratif",
    date: "24 April 2026",
    author: "Tim Artikel",
    excerpt: "Pelajaran iman, keberanian, dan keteguhan prinsip dari kisah para pemuda beriman.",
    gradient: "from-slate-900 to-emerald-800",
    readingTime: "5 menit baca",
    content: [
      "Ashabul Kahfi adalah kisah para pemuda yang menjaga iman di tengah lingkungan yang tidak mendukung kebenaran.",
      "Kisah ini mengajarkan bahwa masa muda adalah waktu terbaik untuk memilih jalan kebaikan, menjaga prinsip, dan mencari teman yang menguatkan iman.",
      "Bagi pelajar hari ini, pelajaran Ashabul Kahfi terasa dekat: berani berbeda dalam kebaikan, tidak mudah ikut arus, dan tetap optimis dengan pertolongan Allah.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
