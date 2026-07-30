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
  Clock,
  BarChart,
} from "lucide-react";
import { popularCourses } from "@/data/courses";
import FloatingIcons from "@/components/FloatingIcons";

const features = [
  {
    title: "Təcrübəli Müəllimlər",
    description:
      "Sahədə illər təcrübəsi olan mütəxəssislərdən real layihələr üzərində öyrənin.",
    icon: GraduationCap,
  },
  {
    title: "Praktik Layihələr",
    description:
      "Hər kurs real dünyada istifadə olunan layihələr üzərində qurulub, nəzəriyyə deyil praktika ön plandadır.",
    icon: Rocket,
  },
  {
    title: "Sertifikat",
    description:
      "Kursu bitirdikdən sonra beynəlxalq tanınan sertifikat qazanaraq karyeranızı inkişaf etdirin.",
    icon: Award,
  },
  {
    title: "Karyera Dəstəyi",
    description:
      "Məzunlarımıza iş tapmaqda və CV hazırlamaqda fərdi dəstək göstəririk.",
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
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Multi-color glow effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-blue-600/5 to-transparent" />
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Floating code icons */}
        <FloatingIcons />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
              <Sparkles size={14} />
              IT və Proqramlaşdırma Kursları
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Gələcəyin texnologiyalarını{" "}
              <span className="gradient-text">birlikdə öyrənək</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--muted)] sm:text-xl">
              Sıfırdan peşəkar proqramçı olmaq üçün lazım olan bütün biliklər.
              Real layihələr, təcrübəli müəllimlər və karyera dəstəyi ilə.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/kurslar"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 sm:w-auto"
              >
                Kurslara bax
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/haqqimizda"
                className="w-full rounded-lg border border-[var(--card-border)] px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--section)] sm:w-auto"
              >
                Haqqımızda
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Populyar kurslar */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Populyar Kurslar</h2>
          <p className="mt-4 text-[var(--muted)]">
            Ən çox seçilən kurslarımıza nəzər salın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-glow group flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-violet-500/40"
            >
              <span className="inline-block w-fit rounded-md bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                {course.category}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug">
                {course.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
                {course.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {course.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BarChart size={12} />
                  {course.level}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--card-border)] pt-4">
                <span className="text-lg font-bold">{course.price}</span>
                <Link
                  href="/kurslar"
                  className="text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent-blue)]"
                >
                  Ətraflı →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/kurslar"
            className="inline-block rounded-lg border border-[var(--card-border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--section)]"
          >
            Bütün kursları gör
          </Link>
        </div>
      </section>

      {/* Niyə bizi seçməlisən */}
      <section className="border-y border-[var(--card-border)] bg-[var(--section)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Niyə bizi seçməlisən?
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Tələbələrimizin uğuru bizim prioritetimizdir
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
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
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {feature.description}
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
            <h2 className="text-3xl font-bold sm:text-4xl">
              Hazırsan? İndi başla!
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
              IT sahəsində karyera qurmaq üçün ilk addımı at. Kurslarımıza
              qoşul və gələcəyini öz əllərinə al.
            </p>
            <Link
              href="/elaqe"
              className="mt-8 inline-block rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Əlaqə saxla
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}