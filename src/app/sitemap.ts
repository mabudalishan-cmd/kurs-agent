import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

/**
 * Sayt xəritəsi.
 *
 * Bloq yazıları və kurslar üçün ayrıca detal səhifəsi yoxdur (hamısı
 * siyahı səhifəsində göstərilir), ona görə xəritə statik yollardan ibarətdir.
 * Detal səhifələri əlavə olunanda bura dinamik sorğu əlavə edilməlidir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
