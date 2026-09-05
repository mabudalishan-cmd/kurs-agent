import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/supabase-errors";
import { formatDate } from "@/lib/date";
import PostDetail, { type PostDetailItem } from "./PostDetail";

export const dynamic = "force-dynamic";

const SELECT =
  "id, title, title_ru, excerpt, excerpt_ru, content, content_ru, author, category, image_url, created_at";

type PostRow = {
  id: string;
  title: string;
  title_ru: string | null;
  excerpt: string | null;
  excerpt_ru: string | null;
  content: string | null;
  content_ru: string | null;
  author: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
};

/** Yazını gətirir; tapılmasa və ya cədvəl yoxdursa `null` qaytarır. */
async function getPost(slug: string): Promise<PostRow | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select(SELECT)
      .eq("id", slug)
      .maybeSingle();

    // Cədvəl hələ yaradılmayıbsa bu gözlənilən vəziyyətdir — log yazmırıq.
    if (error && !isMissingTableError(error)) {
      console.error("Post fetch error:", error.message);
    }
    return (data as PostRow) ?? null;
  } catch (err) {
    console.error("getPost error:", err);
    return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/bloq/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Yazı tapılmadı", robots: { index: false, follow: false } };
  }

  const description = post.excerpt ?? undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/bloq/${post.id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/bloq/${post.id}`,
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/bloq/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) notFound();

  const item: PostDetailItem = {
    id: post.id,
    title: post.title,
    title_ru: post.title_ru,
    content: post.content ?? "",
    content_ru: post.content_ru,
    excerpt: post.excerpt,
    excerpt_ru: post.excerpt_ru,
    author: post.author,
    category: post.category,
    imageUrl: post.image_url,
    date: formatDate(post.created_at, "az"),
    date_ru: formatDate(post.created_at, "ru"),
  };

  return <PostDetail post={item} />;
}
