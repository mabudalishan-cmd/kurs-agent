export type Course = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  category: string;
};

export const courses: Course[] = [
  {
    id: "web-temel",
    title: "Web Proqramlaşdırmaya Giriş",
    description:
      "HTML, CSS və JavaScript əsasları ilə müasir web səhifələr yaradın. Sıfırdan başlayaraq real layihələr qurun.",
    price: "199 AZN",
    duration: "8 həftə",
    level: "Başlanğıc",
    category: "Frontend",
  },
  {
    id: "react-next",
    title: "React və Next.js ilə Müasir Frontend",
    description:
      "React 19 və Next.js 16 istifadə edərək dinamik, sürətli və SEO-dost tətbiqlər inkişaf etdirin.",
    price: "349 AZN",
    duration: "10 həftə",
    level: "Orta",
    category: "Frontend",
  },
  {
    id: "python-ds",
    title: "Python və Data Science",
    description:
      "Python proqramlaşdırma dilini öyrənin, data analizi və maşın öyrənməsi əsaslarını mənimsəyin.",
    price: "399 AZN",
    duration: "12 həftə",
    level: "Orta",
    category: "Data",
  },
  {
    id: "node-backend",
    title: "Node.js ilə Backend İnkişafı",
    description:
      "Node.js, Express və verilənlər bazası istifadə edərək güclü REST API-lər və server tətbiqləri qurun.",
    price: "329 AZN",
    duration: "10 həftə",
    level: "Orta",
    category: "Backend",
  },
  {
    id: "mobile-flutter",
    title: "Flutter ilə Mobil Tətbiq İnkişafı",
    description:
      "Flutter framework-u ilə Android və iOS üçün cross-platform mobil tətbiqlər yaradın.",
    price: "379 AZN",
    duration: "11 həftə",
    level: "Orta",
    category: "Mobil",
  },
  {
    id: "devops",
    title: "DevOps və Cloud Əsasları",
    description:
      "Docker, Kubernetes, CI/CD və AWS ilə müasir DevOps praktikalarını öyrənin.",
    price: "449 AZN",
    duration: "9 həftə",
    level: "Qabaqcıl",
    category: "DevOps",
  },
];

export const popularCourses = courses.slice(0, 4);