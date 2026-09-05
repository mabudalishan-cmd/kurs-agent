"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export type PostDetailItem = {
  id: string;
  title: string;
  title_ru?: string | null;
  content: string;
  content_ru?: string | null;
  excerpt?: string | null;
  excerpt_ru?: string | null;
  author?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  date: string;
  date_ru: string;
};

export default function PostDetail({ post }: { post: PostDetailItem }) {
  const { lang } = useLanguage();

  const pick = (az: string | null | undefined, ru: string | null | undefined) =>
    lang === "ru" && ru?.trim() ? ru : (az ?? "");

  const title = pick(post.title, post.title_ru);
  const body = pick(post.content, post.content_ru);
  const date = lang === "ru" ? post.date_ru : post.date;

  // Mətn düz mətndir (HTML deyil) — sətir sonlarına görə abzaslara bölürük.
  const paragraphs = body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/bloq"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft size={16} />
        {lang === "ru" ? "Все статьи" : "Bütün yazılar"}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        {post.category ? (
          <span className="inline-block rounded-md bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
            {post.category}
          </span>
        ) : null}

        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {date}
          </span>
          {post.author ? (
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {post.author}
            </span>
          ) : null}
        </div>

        {post.imageUrl ? (
          // Şəkil admin panelindən yüklənir; ölçüsü əvvəlcədən bilinmədiyi
          // üçün next/image yerinə adi <img> istifadə olunur.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt=""
            className="mt-8 w-full rounded-2xl border border-[var(--card-border)] object-cover"
          />
        ) : null}

        <div className="mt-8 space-y-5 border-t border-[var(--card-border)] pt-8">
          {paragraphs.length > 0 ? (
            paragraphs.map((text, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-[var(--muted)]"
              >
                {text}
              </p>
            ))
          ) : (
            <p className="text-base text-[var(--muted)]">
              {lang === "ru"
                ? "У этой статьи пока нет содержания."
                : "Bu yazının hələ məzmunu yoxdur."}
            </p>
          )}
        </div>
      </motion.div>
    </article>
  );
}
