"use client";

import { motion } from "framer-motion";
import { Target, Eye, Gem, Sparkles } from "lucide-react";

const stats = [
  { value: "5000+", label: "Məzun" },
  { value: "50+", label: "Kurs" },
  { value: "10+", label: "İl Təcrübə" },
  { value: "98%", label: "Məmnuniyyət" },
];

const values = [
  {
    title: "Keyfiyyət",
    description:
      "Hər kurs müəyyən standartlara uyğun hazırlanır və müntəzəm yenilənir.",
    icon: Gem,
  },
  {
    title: "Praktiklik",
    description:
      "Nəzəri bilikləri real layihələrə tətbiq etməyə fokuslanırıq.",
    icon: Sparkles,
  },
  {
    title: "Dəstək",
    description:
      "Hər tələbəyə fərdi yanaşma və karyera inkişafında dəstək göstəririk.",
    icon: Target,
  },
  {
    title: "İnnovasiya",
    description:
      "Texnologiyadakı ən son yenilikləri tədris proqramımıza daxil edirik.",
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
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Başlıq */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="gradient-text">Haqqımızda</span>
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)]">
          KursAgent 2016-cı ildən bəri Azərbaycanda IT təhsili sahəsində
          fəaliyyət göstərən müasir tədris mərkəzidir. Məqsədimiz gəncləri
          gələcəyin texnologiyaları ilə tanış etmək və onların beynəlxalq
          səviyyəli mütəxəssislər kimi yetişməsində dəstək olmaqdır.
        </p>
      </motion.div>

      {/* Statistika */}
      <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="card-glow rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center"
          >
            <div className="gradient-text text-3xl font-bold sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-[var(--muted)]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Missiya və Vizyon */}
      <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-violet-500/5 to-transparent p-8"
        >
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Missiyamız</h2>
            <p className="mt-4 text-[var(--muted)]">
              Azərbaycanın rəqəmsal iqtisadiyyatına töhfə vermək üçün yüksək
              keyfiyyətli, əlçatan və praktik IT təhsili təqdim etmək. Hər
              tələbənin potensialını tam açmasına kömək etmək və onları
              texnologiya sahəsində uğurlu karyeraya hazırlamaq.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-blue-500/5 to-transparent p-8"
        >
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-[var(--accent-blue)]">
              <Eye size={24} />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Vizyonumuz</h2>
            <p className="mt-4 text-[var(--muted)]">
              Cənubi Qafqazın ən etibarlı və innovativ IT tədris mərkəzi olmaq.
              Məzunlarımızın qlobal şirkətlərdə çalışması və öz startaplarını
              qurması üçün ən yaxşı təməli təqdim etmək.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dəyərlər */}
      <div className="mt-20">
        <motion.div {...fadeUp} className="mb-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Dəyərlərimiz</h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]"
                >
                  <Icon size={24} />
                </motion.div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--accent)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}