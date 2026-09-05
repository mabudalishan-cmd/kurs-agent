import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/supabase-errors";
import CourseDetail, { type CourseDetailItem } from "./CourseDetail";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  title: string;
  title_ru: string | null;
  description: string | null;
  description_ru: string | null;
  duration: string | null;
  level: string | null;
  category: string | null;
  image_url: string | null;
  // 14 nömrəli migrasiya işlədilməyibsə bu sahələr olmaya bilər
  syllabus?: string | null;
  syllabus_ru?: string | null;
};

/**
 * Kursu gətirir.
 *
 * `select("*")` istifadə olunur ki, `syllabus` sütunu hələ əlavə
 * edilməyibsə sorğu xəta verməsin — sahə sadəcə `undefined` gəlir.
 */
async function getCourse(id: string): Promise<CourseRow | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error && !isMissingTableError(error)) {
      console.error("Course fetch error:", error.message);
    }
    return (data as CourseRow) ?? null;
  } catch (err) {
    console.error("getCourse error:", err);
    return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/kurslar/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const course = await getCourse(id);

  if (!course) {
    return { title: "Kurs tapılmadı", robots: { index: false, follow: false } };
  }

  const description = course.description ?? undefined;

  return {
    title: course.title,
    description,
    alternates: { canonical: `/kurslar/${course.id}` },
    openGraph: {
      title: course.title,
      description,
      url: `/kurslar/${course.id}`,
    },
  };
}

export default async function CoursePage(props: PageProps<"/kurslar/[id]">) {
  const { id } = await props.params;
  const course = await getCourse(id);

  if (!course) notFound();

  const item: CourseDetailItem = {
    id: course.id,
    title: course.title,
    title_ru: course.title_ru,
    description: course.description,
    description_ru: course.description_ru,
    duration: course.duration,
    level: course.level,
    category: course.category,
    imageUrl: course.image_url,
    syllabus: course.syllabus ?? null,
    syllabus_ru: course.syllabus_ru ?? null,
  };

  return <CourseDetail course={item} />;
}
