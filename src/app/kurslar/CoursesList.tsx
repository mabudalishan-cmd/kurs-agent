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
  ShieldCheck,
  Swords,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";
import GridBackground from "@/components/GridBackground";
import { BorderBeam } from "@/components/ui/border-beam";
import { CursorGlowLayer, cursorGlowProps } from "@/components/ui/cursor-glow";
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
  { icon: LucideIcon; gradient: string; glow: string; cursorGlow: string }
> = {
  Frontend: {
    icon: Code,
    gradient: "from-violet-500/15 to-purple-500/5",
    glow: "bg-violet-500/15",
    cursorGlow: "rgba(139, 92, 246, 0.28)",
  },
  Backend: {
    icon: Server,
    gradient: "from-blue-500/15 to-cyan-500/5",
    glow: "bg-blue-500/15",
    cursorGlow: "rgba(59, 130, 246, 0.28)",
  },
  Data: {
    icon: Database,
    gradient: "from-emerald-500/15 to-teal-500/5",
    glow: "bg-emerald-500/15",
    cursorGlow: "rgba(16, 185, 129, 0.28)",
  },
  Mobil: {
    icon: Smartphone,
    gradient: "from-orange-500/15 to-amber-500/5",
    glow: "bg-orange-500/15",
    cursorGlow: "rgba(249, 115, 22, 0.28)",
  },
  DevOps: {
    icon: Cloud,
    gradient: "from-sky-500/15 to-indigo-500/5",
    glow: "bg-sky-500/15",
    cursorGlow: "rgba(14, 165, 233, 0.28)",
  },
  Cybersecurity: {
    icon: ShieldCheck,
    gradient: "from-rose-500/15 to-red-500/5",
    glow: "bg-rose-500/15",
    cursorGlow: "rgba(244, 63, 94, 0.28)",
  },
  IT: {
    icon: Cpu,
    gradient: "from-indigo-500/15 to-violet-500/5",
    glow: "bg-indigo-500/15",
    cursorGlow: "rgba(99, 102, 241, 0.28)",
  },
};

const defaultConfig = {
  icon: Layers,
  gradient: "from-violet-500/15 to-blue-500/5",
  glow: "bg-violet-500/15",
  cursorGlow: "rgba(139, 92, 246, 0.28)",
};

/**
 * Kursun adına görə xüsusi görünüş.
 *
 * Kateqoriyadan əvvəl yoxlanılır, çünki adda "Blue Team" / "Red Team"
 * olan kurslar öz tanınmış rənglərini almalıdır — məsələn "Cybersecurity
 * Blue Team" bazada `IT` kateqoriyasındadır, kateqoriyaya baxsaq mavi
 * yerinə bənövşəyi olardı.
 */
const titleConfig: {
  match: RegExp;
  config: (typeof categoryConfig)[string];
}[] = [
  {
    match: /blue\s*team/i,
    config: {
      icon: ShieldCheck,
      gradient: "from-blue-500/15 to-sky-500/5",
      glow: "bg-blue-500/15",
      cursorGlow: "rgba(59, 130, 246, 0.28)",
    },
  },
  {
    match: /red\s*team/i,
    config: {
      icon: Swords,
      gradient: "from-red-500/15 to-orange-500/5",
      glow: "bg-red-500/15",
      cursorGlow: "rgba(239, 68, 68, 0.28)",
    },
  },
];

function getCourseConfig(course: { title: string; category: string }) {
  const byTitle = titleConfig.find((t) => t.match.test(course.title));
  if (byTitle) return byTitle.config;

  const key = Object.keys(categoryConfig).find(
    (k) => k.toLowerCase() === course.category.toLowerCase()
  );
  return key ? categoryConfig[key] : defaultConfig;
}

/** Tək kurs kartı — kateqoriyaya uyğun kursor işığı ilə. */
function CourseCard({
  course,
  index,
  title,
  description,
  registerLabel,
}: {
  course: CourseItem;
  index: number;
  title: string;
  description: string;
  registerLabel: string;
}) {
  const config = getCourseConfig(course);
  const Icon = config.icon;

  return (
    <BorderBeam
      size="md"
      colorVariant="ocean"
      theme="auto"
      duration={8}
      className="h-full"
    >
      <motion.div
        {...cursorGlowProps(config.cursorGlow)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        whileHover={{ y: -4 }}
        className="card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 backdrop-blur-xl transition-all hover:border-violet-500/40"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />

        {/* Kursoru izləyən işıq — rəngi kursun kateqoriyasından gəlir */}
        <CursorGlowLayer size="280px 180px" />

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

          <h2 className="mt-4 text-xl font-semibold leading-snug">{title}</h2>
          <p className="mt-3 flex-1 text-sm text-[var(--muted)]">
            {description}
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
              {registerLabel}
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
          {courses.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              index={i}
              title={getLocalizedTitle(course)}
              description={getLocalizedDesc(course)}
              registerLabel={t("courses.register")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}