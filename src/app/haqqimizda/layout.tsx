import type { Metadata } from "next";

/**
 * page.tsx client komponentdir və `metadata` ixrac edə bilmir,
 * ona görə səhifənin SEO məlumatları burada verilir.
 */
export const metadata: Metadata = {
  title: "Haqqımızda",
  description:
    "HelloWorld Academy — Azərbaycanda praktik texnologiya təhsili üçün qurulmuş yeni nəsil tədris platforması. Missiyamız, vizyonumuz və dəyərlərimiz.",
  alternates: { canonical: "/haqqimizda" },
  openGraph: {
    title: "Haqqımızda | HelloWorld Academy",
    description:
      "Azərbaycanda praktik texnologiya təhsili üçün qurulmuş yeni nəsil tədris platforması.",
    url: "/haqqimizda",
  },
};

export default function HaqqimizdaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
