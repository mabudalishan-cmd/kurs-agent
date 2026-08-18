"use client";

import Link from "next/link";
import { Home, Compass, Bug } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-20">
      {/* Glow effects */}
      <div className="absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
          <Bug size={40} />
        </div>

        <h1 className="text-7xl font-bold tracking-tight sm:text-8xl">
          <span className="gradient-text">{t("notFound.title")}</span>
        </h1>

        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
          {t("notFound.message")}
        </h2>

        <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">
          {t("notFound.description")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 sm:w-auto"
          >
            <Home size={18} />
            {t("notFound.button")}
          </Link>
          <Link
            href="/kurslar"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--card-border)] px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--section)] sm:w-auto"
          >
            <Compass size={18} />
            {t("popular.viewAll")}
          </Link>
        </div>
      </div>
    </div>
  );
}