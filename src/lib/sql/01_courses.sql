-- ============================================================
-- COURSES cədvəli
-- Supabase SQL Editor-da işlədin: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1) Cədvəli yarat (artıq varsa əvvəlcə sil)
DROP TABLE IF EXISTS public.courses CASCADE;

CREATE TABLE public.courses (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  price       numeric NOT NULL DEFAULT 0,
  duration    text NOT NULL,
  image_url   text,
  -- UI-nin ehtiyac duyduğu əlavə sahələr
  level       text NOT NULL DEFAULT 'Başlanğıc',
  category    text NOT NULL DEFAULT 'Ümumi',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2) Row Level Security-i aktivləşdir və anon oxuma icazəsi ver
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses — hərkəs oxuya bilər"
  ON public.courses
  FOR SELECT
  USING (true);

-- (Yalnız autentifikasiya olmuş istifadəçilər yazmaq istəsə nümunə policy)
-- CREATE POLICY "Courses — autentifikasiya olmuş yazmaq"
--   ON public.courses
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);

-- 3) Seed məlumatı — başlanğıc kurslar
INSERT INTO public.courses (id, title, description, price, duration, image_url, level, category) VALUES
  (
    'web-temel',
    'Web Proqramlaşdırmaya Giriş',
    'HTML, CSS və JavaScript əsasları ilə müasir web səhifələr yaradın. Sıfırdan başlayaraq real layihələr qurun.',
    199,
    '8 həftə',
    NULL,
    'Başlanğıc',
    'Frontend'
  ),
  (
    'react-next',
    'React və Next.js ilə Müasir Frontend',
    'React 19 və Next.js 16 istifadə edərək dinamik, sürətli və SEO-dost tətbiqlər inkişaf etdirin.',
    349,
    '10 həftə',
    NULL,
    'Orta',
    'Frontend'
  ),
  (
    'python-ds',
    'Python və Data Science',
    'Python proqramlaşdırma dilini öyrənin, data analizi və maşın öyrənməsi əsaslarını mənimsəyin.',
    399,
    '12 həftə',
    NULL,
    'Orta',
    'Data'
  ),
  (
    'node-backend',
    'Node.js ilə Backend İnkişafı',
    'Node.js, Express və verilənlər bazası istifadə edərək güclü REST API-lər və server tətbiqləri qurun.',
    329,
    '10 həftə',
    NULL,
    'Orta',
    'Backend'
  ),
  (
    'mobile-flutter',
    'Flutter ilə Mobil Tətbiq İnkişafı',
    'Flutter framework-u ilə Android və iOS üçün cross-platform mobil tətbiqlər yaradın.',
    379,
    '11 həftə',
    NULL,
    'Orta',
    'Mobil'
  ),
  (
    'devops',
    'DevOps və Cloud Əsasları',
    'Docker, Kubernetes, CI/CD və AWS ilə müasir DevOps praktikalarını öyrənin.',
    449,
    '9 həftə',
    NULL,
    'Qabaqcıl',
    'DevOps'
  );

-- Yoxlama:
SELECT id, title, price, duration, level, category FROM public.courses ORDER BY created_at;