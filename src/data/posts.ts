export type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
};

export const posts: Post[] = [
  {
    id: "2026-web-trendleri",
    title: "2026-cı ildə Web İnkişafı Trendləri",
    excerpt:
      "React 19, Next.js 16 və server komponentləri haqqında ən son yeniliklər və gələcək istiqamətlər.",
    date: "15 Yanvar 2026",
    author: "Elşən Quliyev",
    category: "Frontend",
  },
  {
    id: "ai-ile-kod-yazmaq",
    title: "AI ilə Kod Yazmaq: Praktik Tövsiyələr",
    excerpt:
      "Süni intellekt alətlərindən proqramçı kimi istifadə etmək və məhsuldarlığı artırmaq yolları.",
    date: "8 Yanvar 2026",
    author: "Nərmin Əliyeva",
    category: "AI",
  },
  {
    id: "python-data-science-bashlangic",
    title: "Python ilə Data Science-ə Başlamaq",
    excerpt:
      "Data analizinə sıfırdan başlamaq üçün lazım olan biliklər, kitabxanalar və ilk addımlar.",
    date: "2 Yanvar 2026",
    author: "Rəşad Məmmədov",
    category: "Data",
  },
];