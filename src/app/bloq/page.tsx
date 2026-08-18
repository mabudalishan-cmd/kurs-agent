import { createServerSupabaseClient } from "@/lib/supabase";
import PostsList, { type PostItem } from "./PostsList";

export const dynamic = "force-dynamic";

const monthNamesAz = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const monthNamesRu = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function formatDate(dateString: string, lang: string): string {
  const date = new Date(dateString);
  const months = lang === "ru" ? monthNamesRu : monthNamesAz;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default async function BloqPage() {
  let posts: PostItem[] = [];

  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, title_ru, excerpt, excerpt_ru, author, category, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase posts fetch error:", error.message);
    }

    posts = (data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      title_ru: p.title_ru,
      excerpt: p.excerpt,
      excerpt_ru: p.excerpt_ru,
      date: formatDate(p.created_at, "az"),
      date_ru: formatDate(p.created_at, "ru"),
      author: p.author,
      category: p.category,
    }));
  } catch (err) {
    console.error("BloqPage error:", err);
    // Render with empty posts — PostsList will show empty state
  }

  return <PostsList posts={posts} />;
}
