import { createServerSupabaseClient } from "@/lib/supabase";
import CoursesAdmin from "./CoursesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminKurslarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, price, duration, level, category, image_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Admin courses fetch error:", error.message);
  }

  const courses = data ?? [];

  return <CoursesAdmin initialCourses={courses} />;
}
