"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BarChart3, CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export type CourseDetailItem = {
  id: string;
  title: string;
  title_ru?: string | null;
  description?: string | null;
  description_ru?: string | null;
  duration?: string | null;
  level?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  syllabus?: string | null;
  syllabus_ru?: string | null;
};

export default function CourseDetail({ course }: { course: CourseDetailItem }) {
  const { lang, t } = useLanguage();

  const pick = (az: string | null | undefined, ru: string | null | undefined) =>
    lang === "ru" && ru?.trim() ? ru : (az ?? "");

  const title = pick(course.title, course.title_ru);
  const description = pick(course.description, course.description_ru);
  const syllabus = pick(course.syllabus, course.syllabus_ru);

  // Sillabus düz mətndir — hər sətir ayrıca bənd kimi göstərilir.
  const lessons = syllabus
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/kurslar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft size={16} />
        {lang === "ru" ? "Все курсы" : "Bütün kurslar"}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        {course.category ? (
          <span className="inline-block rounded-md bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
            {course.category}
          </span>
        ) : null}

        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          {course.duration ? (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {course.duration}
            </span>
          ) : null}
          {course.level ? (
            <span className="flex items-center gap-1.5">
              <BarChart3 size={14} />
              {course.level}
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="mt-6 text-base leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        ) : null}

        {/* Sillabus */}
        <div className="mt-10 border-t border-[var(--card-border)] pt-8">
          <h2 className="text-xl font-bold sm:text-2xl">
            {lang === "ru" ? "Программа курса" : "Kursun proqramı"}
          </h2>

          {lessons.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {lessons.map((lesson, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--accent)]"
                  />
                  <span className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    {lesson}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">
              {lang === "ru"
                ? "Программа курса скоро будет опубликована."
                : "Kursun proqramı tezliklə yerləşdiriləcək."}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--card-border)] pt-8 sm:flex-row">
          <Link
            href="/elaqe"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
          >
            {t("courses.register")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
