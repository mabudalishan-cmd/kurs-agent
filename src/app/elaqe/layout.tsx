import type { Metadata } from "next";

/**
 * page.tsx client komponentdir və `metadata` ixrac edə bilmir,
 * ona görə səhifənin SEO məlumatları burada verilir.
 */
export const metadata: Metadata = {
  title: "Əlaqə",
  description:
    "HelloWorld Academy ilə əlaqə saxlayın — kurslar, qeydiyyat və əməkdaşlıq üçün bizə yazın.",
  alternates: { canonical: "/elaqe" },
  openGraph: {
    title: "Əlaqə | HelloWorld Academy",
    description:
      "Kurslar, qeydiyyat və əməkdaşlıq üçün HelloWorld Academy ilə əlaqə saxlayın.",
    url: "/elaqe",
  },
};

export default function ElaqeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
