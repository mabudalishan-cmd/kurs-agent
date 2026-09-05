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
