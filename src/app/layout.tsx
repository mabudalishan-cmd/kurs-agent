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

export const metadata: Metadata = {
  title: "HelloWorld",
  description: "Azərbaycan dilində kurs saytı üçün AI agent layihəsi",
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