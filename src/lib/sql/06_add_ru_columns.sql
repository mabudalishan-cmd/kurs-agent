-- ============================================================
-- RU (Rus dili) sütunlarının əlavə edilməsi
-- courses və posts cədvəllərinə _ru sahələri əlavə edir
-- Supabase SQL Editor-da işlədin: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1) COURSES cədvəlinə RU sütunları əlavə et
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_ru text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_ru text;

-- 2) POSTS cədvəlinə RU sütunları əlavə et
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title_ru text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content_ru text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt_ru text;

-- 3) Yoxlama — yeni sütunları göstər
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('courses', 'posts')
  AND column_name LIKE '%_ru'
ORDER BY table_name, column_name;

-- 4) (Opsional) Mövcud kurslara RU tərcümələri əlavə et
-- Aşağıdakı nümunələri açıb işlədə bilərsiniz:
/*
UPDATE public.courses SET
  title_ru = 'Введение в веб-программирование',
  description_ru = 'Изучите основы HTML, CSS и JavaScript для создания современных веб-страниц. Начните с нуля и стройте реальные проекты.'
WHERE id = 'web-temel';

UPDATE public.courses SET
  title_ru = 'Современный фронтенд с React и Next.js',
  description_ru = 'Используйте React 19 и Next.js 16 для разработки динамичных, быстрых и SEO-дружелюбных приложений.'
WHERE id = 'react-next';
*/