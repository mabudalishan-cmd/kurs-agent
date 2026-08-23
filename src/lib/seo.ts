/**
 * SEO üçün mərkəzi məlumatlar.
 *
 * Domen `NEXT_PUBLIC_SITE_URL` ilə verilir — canonical linklər, sitemap və
 * OG şəkilləri mütləq (absolute) URL tələb edir. Dəyər verilməyibsə
 * localhost istifadə olunur ki, lokal işləmə pozulmasın.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SITE_NAME = "HelloWorld Academy";

export const SITE_DESCRIPTION =
  "Azərbaycanda proqramlaşdırma və kiber təhlükəsizlik kursları — Red Team və Blue Team təlimləri. Real layihələr və praktiki təcrübə ilə öyrən.";

export const DEFAULT_TITLE = `${SITE_NAME} — Proqramlaşdırma və Kiber Təhlükəsizlik Kursları`;

/** Saytda indeksləşdirilən səhifələr — sitemap və naviqasiya üçün tək mənbə. */
export const PUBLIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/kurslar", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/haqqimizda", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/bloq", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/elaqe", priority: 0.6, changeFrequency: "yearly" as const },
];

/**
 * Təşkilat üçün strukturlaşdırılmış məlumat (JSON-LD).
 * Google-un "rich result"-larında və Knowledge Panel-də istifadə olunur.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    alternateName: "HelloWorld",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: "info@helloworld.az",
    areaServed: {
      "@type": "Country",
      name: "Azerbaijan",
    },
    knowsLanguage: ["az", "ru"],
  };
}

/** FAQ strukturlaşdırılmış məlumatı — Google-da açılan sual blokları üçün. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
