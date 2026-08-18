import { createServerSupabaseClient } from "@/lib/supabase";
import PostsAdmin from "./PostsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminBloqPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, excerpt, author, category, image_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Admin posts fetch error:", error.message);
  }

  const posts = data ?? [];

  return <PostsAdmin initialPosts={posts} />;
}