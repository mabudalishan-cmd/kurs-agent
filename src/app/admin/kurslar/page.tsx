import { createServerSupabaseClient } from "@/lib/supabase";
import CoursesAdmin from "./CoursesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminKurslarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("courses")
    // `*` — 14 nömrəli migrasiya işlədilməyibsə syllabus sütununun
    // olmaması sorğunu sındırmasın deyə
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Admin courses fetch error:", error.message);
  }

  const courses = data ?? [];

  return <CoursesAdmin initialCourses={courses} />;
}
