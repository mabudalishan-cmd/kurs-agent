import { createServerSupabaseClient } from "@/lib/supabase";
import TeamAdmin, { type TeamMember } from "./TeamAdmin";

export const dynamic = "force-dynamic";

export default async function HesablarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, photo_url, role, first_name, last_name, first_name_en, last_name_en, bio_en, first_name_ru, last_name_ru, bio_ru, bio, email, linkedin_url, facebook_url, instagram_url, display_order, created_at"
    )
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Supabase team_members fetch error:", error.message);
  }

  const members: TeamMember[] = (data ?? []).map((m) => ({
    id: m.id,
    photo_url: m.photo_url,
    role: m.role,
    first_name: m.first_name,
    last_name: m.last_name,
    first_name_en: m.first_name_en,
    last_name_en: m.last_name_en,
    bio_en: m.bio_en,
    first_name_ru: m.first_name_ru,
    last_name_ru: m.last_name_ru,
    bio_ru: m.bio_ru,
    bio: m.bio,
    email: m.email,
    linkedin_url: m.linkedin_url,
    facebook_url: m.facebook_url,
    instagram_url: m.instagram_url,
    display_order: m.display_order,
  }));

  return <TeamAdmin initialMembers={members} />;
}