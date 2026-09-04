"use client";

import { motion } from "framer-motion";
import { Target, Eye, Gem, Sparkles } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import { BorderBeam } from "@/components/ui/border-beam";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const values: {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: typeof Gem;
}[] = [
  {
    titleKey: "about.values.quality.title",
    descKey: "about.values.quality.desc",
    icon: Gem,
  },
  {
    titleKey: "about.values.practicality.title",
    descKey: "about.values.practicality.desc",
    icon: Sparkles,
  },
  {
    titleKey: "about.values.support.title",
    descKey: "about.values.support.desc",
    icon: Target,
  },
  {
    titleKey: "about.values.innovation.title",
    descKey: "about.values.innovation.desc",
    icon: Eye,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function HaqqimizdaPage() {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Başlıq */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">{t("about.title")}</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--muted)]">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Missiya və Vizyon */}
        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BorderBeam size="md" colorVariant="ocean" theme="auto" duration={8} className="h-full">
            <motion.div
              {...fadeUp}
              className="relative h-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-violet-500/5 to-transparent p-8"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
                  <Target size={24} />
                </div>
                <h2 className="mt-4 text-2xl font-bold">
                  {t("about.mission.title")}
                </h2>
                <p className="mt-4 text-[var(--muted)]">
                  {t("about.mission.description")}
                </p>
              </div>
            </motion.div>
          </BorderBeam>

          <BorderBeam size="md" colorVariant="ocean" theme="auto" duration={8} className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative h-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-blue-500/5 to-transparent p-8"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-[var(--accent-blue)]">
                  <Eye size={24} />
                </div>
                <h2 className="mt-4 text-2xl font-bold">
                  {t("about.vision.title")}
                </h2>
                <p className="mt-4 text-[var(--muted)]">
                  {t("about.vision.description")}
                </p>
              </div>
            </motion.div>
          </BorderBeam>
        </div>

        {/* Dəyərlər */}
        <div className="mt-20">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("about.values.title")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <BorderBeam
                  key={value.titleKey}
                  size="md"
                  colorVariant="ocean"
                  theme="auto"
                  duration={8}
                  className="h-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="h-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]"
                    >
                      <Icon size={24} />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--accent)]">
                      {t(value.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {t(value.descKey)}
                    </p>
                  </motion.div>
                </BorderBeam>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
