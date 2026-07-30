import { createServerSupabaseClient } from "@/lib/supabase";
import CoursesList, { type CourseItem } from "./CoursesList";

export const dynamic = "force-dynamic";

export default async function KurslarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, price, duration, level, category")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase courses fetch error:", error.message);
  }

  const courses: CourseItem[] = (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    price: `${c.price} AZN`,
    duration: c.duration,
    level: c.level,
    category: c.category,
  }));

  return <CoursesList courses={courses} />;
}
