"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Rocket,
  Award,
  Briefcase,
  ArrowRight,
  Sparkles,
  Flame,
} from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";
import GridBackground from "@/components/GridBackground";
import ParticlesBackground from "@/components/ParticlesBackground";
import { SplineDemo } from "@/components/ui/spline-demo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";
import FAQSection from "@/components/FAQSection";

const features: {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: typeof GraduationCap;
}[] = [
  {
    titleKey: "features.experiencedTeachers.title",
    descKey: "features.experiencedTeachers.desc",
    icon: GraduationCap,
  },
  {
    titleKey: "features.practicalProjects.title",
    descKey: "features.practicalProjects.desc",
    icon: Rocket,
  },
  {
    titleKey: "features.certificate.title",
    descKey: "features.certificate.desc",
    icon: Award,
  },
  {
    titleKey: "features.careerSupport.title",
    descKey: "features.careerSupport.desc",
    icon: Briefcase,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Grid + Particles arxa fon */}
        <GridBackground />
        <ParticlesBackground />

        {/* Multi-color glow effects */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-violet-600/10 via-blue-600/5 to-transparent" />
        <div className="pointer-events-none absolute -top-40 left-1/4 z-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-1/4 z-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute top-20 left-1/2 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Floating code icons */}
        <FloatingIcons />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
              <Sparkles size={14} />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title")}{" "}
              <span className="gradient-text">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--muted)] sm:text-xl">
              {t("hero.description")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/kurslar"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 sm:w-auto"
              >
                {t("hero.cta1")}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/haqqimizda"
                className="w-full rounded-lg border border-[var(--card-border)] px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--section)] sm:w-auto"
              >
                {t("hero.cta2")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive 3D Spline Scene */}
      <motion.div {...fadeUp} className="w-full">
        <SplineDemo />
      </motion.div>

      {/* FAQ */}
      <FAQSection />

      {/* Niyə bizi seçməlisən */}
      <section className="border-y border-[var(--card-border)] bg-[var(--section)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-[var(--muted)]">{t("features.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {t(feature.descKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-500/10 p-10 text-center sm:p-16"
        >
          <div className="absolute -top-20 left-1/3 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
              {t("cta.description")}
            </p>
            <Link
              href="/elaqe"
              className="mt-8 inline-block rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              {t("cta.button")}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Kampaniya banneri */}
      <section className="relative overflow-hidden border-t border-violet-500/20 bg-gradient-to-r from-violet-600/20 via-blue-600/15 to-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-[var(--accent)]">
              <Flame size={12} />
              {t("campaign.badge")}
            </span>
            <p className="text-sm font-semibold text-[var(--foreground)] sm:text-base">
              {t("campaign.text")}{" "}
              <span className="gradient-text">{t("campaign.highlight")}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}