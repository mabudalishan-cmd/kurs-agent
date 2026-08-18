import { createServerSupabaseClient } from "@/lib/supabase";
import FaqAdmin from "./FaqAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSuallarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("faq_items")
    .select(
      "id, question, answer, question_ru, answer_ru, display_order, is_active"
    )
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Admin FAQ fetch error:", error.message);
  }

  return <FaqAdmin initialItems={data ?? []} />;
}
