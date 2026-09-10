import type { Metadata } from "next";

/**
 * CodePlayground client komponentdir və `metadata` ixrac edə bilmir,
 * ona görə səhifənin SEO məlumatları burada verilir.
 */
export const metadata: Metadata = {
  title: "Workshop — kodu brauzerdə yaz və nəticəni gör",
  description:
    "HelloWorld Academy-nin pulsuz interaktiv məşq sahəsi: HTML, CSS və JavaScript kodunu birbaşa brauzerdə yaz, bir düymə ilə nəticəsini dərhal gör. Qeydiyyat tələb olunmur.",
  alternates: { canonical: "/workshop" },
  openGraph: {
    title: "Workshop | HelloWorld Academy",
    description:
      "HTML, CSS və JavaScript kodunu brauzerdə yaz və nəticəsini dərhal gör — pulsuz interaktiv məşq.",
    url: "/workshop",
  },
};

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
