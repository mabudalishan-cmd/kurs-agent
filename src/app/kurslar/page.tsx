import { createServerSupabaseClient } from "@/lib/supabase";
import CoursesList, { type CourseItem } from "./CoursesList";

export const dynamic = "force-dynamic";

export default async function KurslarPage() {
  let courses: CourseItem[] = [];

  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("courses")
      .select(
        "id, title, title_ru, description, description_ru, price, duration, level, category"
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase courses fetch error:", error.message);
    }

    courses = (data ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      title_ru: c.title_ru,
      description: c.description,
      description_ru: c.description_ru,
      price: `${c.price} AZN`,
      duration: c.duration,
      level: c.level,
      category: c.category,
    }));
  } catch (err) {
    console.error("KurslarPage error:", err);
    // Render with empty courses — CoursesList will show empty state
  }

  return <CoursesList courses={courses} />;
}
