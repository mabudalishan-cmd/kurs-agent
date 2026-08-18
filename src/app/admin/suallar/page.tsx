import { createServerSupabaseClient } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/supabase-errors";
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

  // Cədvəl hələ yaradılmayıbsa bu gözlənilən vəziyyətdir — səhifə xəta
  // atmır, əvəzində quraşdırma göstərişi göstərir.
  const setupRequired = isMissingTableError(error);

  if (error && !setupRequired) {
    console.error("Admin FAQ fetch error:", error.message);
  }

  return <FaqAdmin initialItems={data ?? []} setupRequired={setupRequired} />;
}
