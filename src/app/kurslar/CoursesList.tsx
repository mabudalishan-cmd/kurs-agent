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
import type { TranslationKey } from "@/lib/i18n/translations";

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

type CourseVisual = {
  icon: LucideIcon;
  gradient: string;
  glow: string;
  cursorGlow: string;
  /** Hover zamanı sərhəd rəngi — kartın öz rəngi ilə uyğun olsun deyə. */
  hoverBorder: string;
};

const DEFAULT_HOVER_BORDER = "hover:border-violet-500/40";

const categoryConfig: Record<string, CourseVisual> = {
  Frontend: {
    icon: Code,
    gradient: "from-violet-500/15 to-purple-500/5",
    glow: "bg-violet-500/15",
    cursorGlow: "rgba(139, 92, 246, 0.28)",
    hoverBorder: DEFAULT_HOVER_BORDER,
  },
  Backend: {
    icon: Server,
    gradient: "from-blue-500/15 to-cyan-500/5",
    glow: "bg-blue-500/15",
    cursorGlow: "rgba(59, 130, 246, 0.28)",
    hoverBorder: "hover:border-blue-500/40",
  },
  Data: {
    icon: Database,
    gradient: "from-emerald-500/15 to-teal-500/5",
    glow: "bg-emerald-500/15",
    cursorGlow: "rgba(16, 185, 129, 0.28)",
    hoverBorder: "hover:border-emerald-500/40",
  },
  Mobil: {
    icon: Smartphone,
    gradient: "from-orange-500/15 to-amber-500/5",
    glow: "bg-orange-500/15",
    cursorGlow: "rgba(249, 115, 22, 0.28)",
    hoverBorder: "hover:border-orange-500/40",
  },
  DevOps: {
    icon: Cloud,
    gradient: "from-sky-500/15 to-indigo-500/5",
    glow: "bg-sky-500/15",
    cursorGlow: "rgba(14, 165, 233, 0.28)",
    hoverBorder: "hover:border-sky-500/40",
  },
  Cybersecurity: {
    icon: ShieldCheck,
    gradient: "from-rose-500/15 to-red-500/5",
    glow: "bg-rose-500/15",
    cursorGlow: "rgba(244, 63, 94, 0.28)",
    hoverBorder: "hover:border-rose-500/40",
  },
  IT: {
    icon: Cpu,
    gradient: "from-indigo-500/15 to-violet-500/5",
    glow: "bg-indigo-500/15",
    cursorGlow: "rgba(99, 102, 241, 0.28)",
    hoverBorder: "hover:border-indigo-500/40",
  },
};

const defaultConfig = {
  icon: Layers,
  gradient: "from-violet-500/15 to-blue-500/5",
  glow: "bg-violet-500/15",
  cursorGlow: "rgba(139, 92, 246, 0.28)",
  hoverBorder: DEFAULT_HOVER_BORDER,
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
      hoverBorder: "hover:border-blue-500/40",
    },
  },
  {
    match: /red\s*team/i,
    config: {
      icon: Swords,
      // #c30010 — tünd qırmızı. Əvvəl ikinci dayaq narıncı idi, ona görə
      // hover zamanı kart narıncıya çalırdı.
      gradient: "from-[#c30010]/25 to-[#c30010]/5",
      glow: "bg-[#c30010]/20",
      // Rəng tünd olduğu üçün tünd fonda görünmək üçün daha yüksək qatılıq
      cursorGlow: "rgba(195, 0, 16, 0.42)",
      hoverBorder: "hover:border-[#c30010]/70",
    },
  },
];

/**
 * Kurs səviyyəsinin tərcüməsi.
 *
 * Bazadakı dəyər sərbəst mətndir ("Baslangic", "Başlanğıc", "Orta"...),
 * ona görə diakritikləri təmizləyib açara çeviririk. Uyğun açar yoxdursa
 * bazadakı dəyər olduğu kimi göstərilir.
 */
const LEVEL_KEYS: Record<string, TranslationKey> = {
  baslangic: "courses.level.baslangic",
  orta: "courses.level.orta",
  yuksek: "courses.level.yuksek",
};

function normalizeLevel(level: string) {
  return level
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z]/g, "");
}

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
  levelLabel,
}: {
  course: CourseItem;
  index: number;
  title: string;
  description: string;
  registerLabel: string;
  levelLabel: string;
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
        className={`card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 backdrop-blur-xl transition-all ${config.hoverBorder}`}
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
              {levelLabel}
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

  // Bazadakı səviyyə dəyəri tərcümə olunur; tanınmayan dəyər olduğu kimi qalır.
  const getLevelLabel = (level: string) => {
    const key = LEVEL_KEYS[normalizeLevel(level)];
    return key ? t(key) : level;
  };

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
              levelLabel={getLevelLabel(course.level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}