import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";
import { createServerSupabaseClient } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/supabase-errors";

/**
 * Sayt xəritəsi: statik yollar + bloq yazılarının detal səhifələri.
 *
 * Kurslar üçün ayrıca detal səhifəsi yoxdur (hamısı siyahıda göstərilir),
 * ona görə yalnız `/kurslar` daxil edilir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];

  // Baza əlçatan deyilsə sitemap statik yollarla qaytarılır — sıfır yox.
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (error && !isMissingTableError(error)) {
      console.error("Sitemap posts fetch error:", error.message);
    }

    postRoutes = (data ?? []).map((post) => ({
      url: `${SITE_URL}/bloq/${post.id}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap error:", err);
  }

  return [...staticRoutes, ...postRoutes];
}
