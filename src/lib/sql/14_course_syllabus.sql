-- ============================================================
-- 14_course_syllabus.sql
-- Kurslara sillabus (dərs planı) sahəsi
-- Bu fayl Supabase SQL Editor-də icra edilməlidir
-- ============================================================
--
-- Sillabus kursun detal səhifəsində göstərilir (/kurslar/<id>) və
-- admin panelindən (/admin/kurslar) doldurulur.
--
-- Mətn düz mətn kimi saxlanılır — hər sətir ayrıca bənd kimi göstərilir.
-- ============================================================

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS syllabus TEXT;

-- Rus dili tərcüməsi (boş qalarsa Azərbaycan mətni göstərilir)
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS syllabus_ru TEXT;

-- PostgREST sxemi keşdə saxlayır. Yeni sütun bəzən dərhal görünmür,
-- ona görə keşi açıq şəkildə yeniləyirik.
NOTIFY pgrst, 'reload schema';

-- Yoxlama: aşağıdakı sorğu `syllabus` və `syllabus_ru` sətirlərini
-- qaytarmalıdır. Qaytarmırsa, yuxarıdakı ALTER icra olunmayıb.
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'courses'
  AND column_name IN ('syllabus', 'syllabus_ru');
