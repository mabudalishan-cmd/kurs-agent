import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import BootScreen from "@/components/BootScreen";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AIChatWidget from "@/components/AIChatWidget";
import {
  DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Canonical, OG şəkli və sitemap mütləq URL tələb edir
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  // `template` sayəsində alt səhifələr öz başlığını verə bilər:
  // "Kurslar" -> "Kurslar | HelloWorld Academy"
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "proqramlaşdırma kursları",
    "kiber təhlükəsizlik kursu",
    "Red Team təlimi",
    "Blue Team təlimi",
    "IT kursları Azərbaycan",
    "proqramlaşdırma öyrən",
    "HelloWorld Academy",
  ],
  applicationName: SITE_NAME,
  // Link paylaşılanda (Instagram, LinkedIn, WhatsApp) göstərilən kart
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "az_AZ",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Strukturlaşdırılmış məlumat — Google təşkilatı tanısın deyə.
            Məzmun JSON.stringify ilə qurulur, kənar giriş yoxdur. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <BootScreen />
            <SiteChrome />
            <AnalyticsTracker />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <AIChatWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}