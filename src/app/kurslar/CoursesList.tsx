"use client";

import { motion } from "framer-motion";
import {
  Clock,
  ArrowRight,
  Code,
  Server,
  Database,
  Smartphone,
  Cloud,
  Layers,
  type LucideIcon,
} from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";
import GridBackground from "@/components/GridBackground";
import { BorderBeam } from "@/components/ui/border-beam";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export type CourseItem = {
  id: string;
  title: string;
  title_ru?: string | null;
  description: string;
  description_ru?: string | null;
  price: string;
  duration: string;
  level: string;
  category: string;
};

const categoryConfig: Record<
  string,
  { icon: LucideIcon; gradient: string; glow: string }
> = {
  Frontend: {
    icon: Code,
    gradient: "from-violet-500/15 to-purple-500/5",
    glow: "bg-violet-500/15",
  },
  Backend: {
    icon: Server,
    gradient: "from-blue-500/15 to-cyan-500/5",
    glow: "bg-blue-500/15",
  },
  Data: {
    icon: Database,
    gradient: "from-emerald-500/15 to-teal-500/5",
    glow: "bg-emerald-500/15",
  },
  Mobil: {
    icon: Smartphone,
    gradient: "from-orange-500/15 to-amber-500/5",
    glow: "bg-orange-500/15",
  },
  DevOps: {
    icon: Cloud,
    gradient: "from-sky-500/15 to-indigo-500/5",
    glow: "bg-sky-500/15",
  },
};

const defaultConfig = {
  icon: Layers,
  gradient: "from-violet-500/15 to-blue-500/5",
  glow: "bg-violet-500/15",
};

function getCategoryConfig(category: string) {
  const key = Object.keys(categoryConfig).find(
    (k) => k.toLowerCase() === category.toLowerCase()
  );
  return key ? categoryConfig[key] : defaultConfig;
}

export default function CoursesList({ courses }: { courses: CourseItem[] }) {
  const { t, lang } = useLanguage();

  // RU dilində _ru sahəsi varsa onu göstər, yoxsa default (AZ)
  const getLocalizedTitle = (course: CourseItem) =>
    lang === "ru" && course.title_ru?.trim() ? course.title_ru : course.title;

  const getLocalizedDesc = (course: CourseItem) =>
    lang === "ru" && course.description_ru?.trim()
      ? course.description_ru
      : course.description;

  return (
    <div className="relative">
      <GridBackground />
      <FloatingIcons />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">{t("courses.title")}</span>
          </h1>
          <p className="mt-4 text-[var(--muted)]">{t("courses.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => {
            const config = getCategoryConfig(course.category);
            const Icon = config.icon;

            return (
              <BorderBeam
                key={course.id}
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
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-violet-500/40"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)] ${config.glow}`}
                      >
                        <Icon size={28} />
                      </motion.div>
                      <span className="rounded-md border border-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--muted)]">
                        {course.level}
                      </span>
                    </div>

                    <span className="inline-block w-fit rounded-md bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                      {course.category}
                    </span>

                    <h2 className="mt-4 text-xl font-semibold leading-snug">
                      {getLocalizedTitle(course)}
                    </h2>
                    <p className="mt-3 flex-1 text-sm text-[var(--muted)]">
                      {getLocalizedDesc(course)}
                    </p>

                    <div className="mt-6 flex items-center gap-4 text-sm text-[var(--muted)]">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {course.duration}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--card-border)] pt-4">
                      <span className="text-2xl font-bold">{course.price}</span>
                      <button className="group/btn inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25">
                        {t("courses.register")}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover/btn:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </BorderBeam>
            );
          })}
        </div>
      </div>
    </div>
  );
}