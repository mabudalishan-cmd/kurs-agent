-- ============================================================
-- 09_faq_items.sql
-- Tez-tez verilən suallar (FAQ) cədvəli
-- Bu fayl Supabase SQL Editor-də icra edilməlidir
-- ============================================================
--
-- Bu cədvəl iki yerdə istifadə olunur:
--   1. Ana səhifədəki FAQSection komponenti (public oxuma)
--   2. /api/chat — AI köməkçinin bilgi bazası
-- ============================================================

CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  -- Rus dili tərcümələri (boş qalarsa Azərbaycan mətni göstərilir)
  question_ru TEXT,
  answer_ru TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sıralama üçün indeks
CREATE INDEX IF NOT EXISTS idx_faq_items_display_order
  ON public.faq_items (display_order);

-- ============================================================
-- RLS siyasətləri
-- ============================================================

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Hamı oxuya bilər (ana səhifə və AI chat üçün)
DROP POLICY IF EXISTS "faq_items_select_public" ON public.faq_items;
CREATE POLICY "faq_items_select_public" ON public.faq_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- Yalnız admin (authenticated) dəyişə bilər
DROP POLICY IF EXISTS "faq_items_insert_authenticated" ON public.faq_items;
CREATE POLICY "faq_items_insert_authenticated" ON public.faq_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "faq_items_update_authenticated" ON public.faq_items;
CREATE POLICY "faq_items_update_authenticated" ON public.faq_items
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "faq_items_delete_authenticated" ON public.faq_items;
CREATE POLICY "faq_items_delete_authenticated" ON public.faq_items
  FOR DELETE TO authenticated
  USING (true);

-- ============================================================
-- Başlanğıc məlumatlar
-- Əvvəllər FAQSection.tsx faylında hardcoded olan suallar
-- ============================================================

INSERT INTO public.faq_items (question, answer, display_order)
SELECT * FROM (VALUES
  ('Kurslar necə keçirilir?',
   'Bütün kurslarımız onlayn formatda, canlı dərslər və qeydə alınmış videolar şəklində keçirilir.',
   1),
  ('Sertifikat alıram mı?',
   'Bəli, hər kursu uğurla bitirdikdə beynəlxalq tanınan sertifikat əldə edirsiniz.',
   2),
  ('Ödəniş necə edilir?',
   'Kart vasitəsilə tam ödəniş və ya aylıq hissələrlə ödəniş edə bilərsiniz.',
   3),
  ('Əvvəlcədən təcrübəm olmalıdır?',
   'Xeyr, kurslarımızın çoxu sıfırdan başlayanlar üçün nəzərdə tutulub.',
   4),
  ('Kursu bitirdikdən sonra iş tapmaqda kömək olunur?',
   'Bəli, məzunlarımıza CV hazırlığı və iş yerləşdirmə dəstəyi göstəririk.',
   5)
) AS seed(question, answer, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.faq_items);
