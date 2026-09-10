"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export type PostItem = {
  id: string;
  title: string;
  title_ru?: string | null;
  excerpt: string;
  excerpt_ru?: string | null;
  date: string;
  date_ru: string;
  author: string;
  category: string;
};

export default function PostsList({ posts }: { posts: PostItem[] }) {
  const { t, lang } = useLanguage();

  const getLocalizedTitle = (post: PostItem) =>
    lang === "ru" && post.title_ru?.trim() ? post.title_ru : post.title;

  const getLocalizedExcerpt = (post: PostItem) =>
    lang === "ru" && post.excerpt_ru?.trim() ? post.excerpt_ru : post.excerpt;

  const getLocalizedDate = (post: PostItem) =>
    lang === "ru" ? post.date_ru : post.date;

  return (
    // Dekorativ axan xətlər — məzmun `relative z-10` ilə onların üstündədir.
    <FloatingPathsBackground position={-1} className="overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">{t("nav.blog")}</span>
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            {lang === "ru"
              ? "Статьи о технологиях и программировании"
              : "Texnologiya və proqramlaşdırma haqqında məqalələr"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="liquid-glass card-glow group flex flex-col overflow-hidden rounded-2xl transition-all hover:border-violet-500/40"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-600/30 via-blue-600/20 to-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/50 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {getLocalizedDate(post)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {post.author}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold leading-snug">
                  {getLocalizedTitle(post)}
                </h2>
                <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
                  {getLocalizedExcerpt(post)}
                </p>

                <Link
                  href={`/bloq/${post.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-blue)]"
                >
                  {lang === "ru" ? "Читать далее" : "Daha çox oxu"}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </FloatingPathsBackground>
  );
}
