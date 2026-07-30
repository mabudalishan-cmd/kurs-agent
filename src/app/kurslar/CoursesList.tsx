"use client";

import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight } from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";

export type CourseItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  category: string;
};

export default function CoursesList({ courses }: { courses: CourseItem[] }) {
  return (
    <div className="relative">
      <FloatingIcons />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Başlıq */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">Kurslar</span>
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Müxtəlif sahələr üzrə kurslarımızı kəşf edin
          </p>
        </motion.div>

        {/* Kurs kartları */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-glow group flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                  <Tag size={11} />
                  {course.category}
                </span>
                <span className="rounded-md border border-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--muted)]">
                  {course.level}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold leading-snug">
                {course.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-[var(--muted)]">
                {course.description}
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
                  Qeydiyyat
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover/btn:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}