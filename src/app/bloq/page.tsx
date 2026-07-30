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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()} ${monthNamesAz[date.getMonth()]} ${date.getFullYear()}`;
}

export default async function BloqPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, author, category, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
  }

  const posts: PostItem[] = (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    date: formatDate(p.created_at),
    author: p.author,
    category: p.category,
  }));

  return <PostsList posts={posts} />;
}
