import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import BootScreen from "@/components/BootScreen";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AIChatWidget from "@/components/AIChatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "HelloWorld Academy";
const SITE_DESCRIPTION =
  "Azərbaycanda proqramlaşdırma, kiber təhlükəsizlik və DevOps kursları. Real layihələr və praktiki təcrübə ilə gələcəyin texnologiyalarını öyrən.";

export const metadata: Metadata = {
  // `template` sayəsində alt səhifələr öz başlığını verə bilər:
  // "Kurslar" -> "Kurslar | HelloWorld Academy"
  title: {
    default: `${SITE_NAME} — Proqramlaşdırma və Kiber Təhlükəsizlik Kursları`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "proqramlaşdırma kursları",
    "kiber təhlükəsizlik kursu",
    "DevOps kursu",
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
    title: `${SITE_NAME} — Proqramlaşdırma və Kiber Təhlükəsizlik Kursları`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Proqramlaşdırma və Kiber Təhlükəsizlik Kursları`,
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