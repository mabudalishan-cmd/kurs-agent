-- ============================================================
-- POSTS (bloq) cədvəli
-- Supabase SQL Editor-da işlədin: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1) Cədvəli yarat (artıq varsa əvvəlcə sil)
DROP TABLE IF EXISTS public.posts CASCADE;

CREATE TABLE public.posts (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  content     text NOT NULL,
  excerpt     text NOT NULL,
  image_url   text,
  -- UI-nin ehtiyac duyduğu əlavə sahələr
  author      text NOT NULL DEFAULT 'Redaksiya',
  category    text NOT NULL DEFAULT 'Ümumi',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2) Row Level Security-i aktivləşdir və anon oxuma icazəsi ver
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts — hərkəs oxuya bilər"
  ON public.posts
  FOR SELECT
  USING (true);

-- (Yalnız autentifikasiya olmuş istifadəçilər yazmaq istəsə nümunə policy)
-- CREATE POLICY "Posts — autentifikasiya olmuş yazmaq"
--   ON public.posts
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);

-- 3) Seed məlumatı — src/data/posts.ts-dəki mövcud məqalələr
INSERT INTO public.posts (id, title, content, excerpt, image_url, author, category, created_at) VALUES
  (
    '2026-web-trendleri',
    '2026-cı ildə Web İnkişafı Trendləri',
    'React 19, Next.js 16 və server komponentləri texnologiyada ən son yenilikləri gətirir. Bu məqalədə müasir web inkişafının gələcək istiqamətlərini və praktik tövsiyələri nəzərdən keçiririk.',
    'React 19, Next.js 16 və server komponentləri haqqında ən son yeniliklər və gələcək istiqamətlər.',
    NULL,
    'Elşən Quliyev',
    'Frontend',
    '2026-01-15 10:00:00+00'
  ),
  (
    'ai-ile-kod-yazmaq',
    'AI ilə Kod Yazmaq: Praktik Tövsiyələr',
    'Süni intellekt alətlərindən proqramçı kimi istifadə etmək məhsuldarlığı xeyli artıra bilər. Doğru promptlar, kod review və təhlükəsizlik nüansları haqqında praktik məsləhətlər.',
    'Süni intellekt alətlərindən proqramçı kimi istifadə etmək və məhsuldarlığı artırmaq yolları.',
    NULL,
    'Nərmin Əliyeva',
    'AI',
    '2026-01-08 10:00:00+00'
  ),
  (
    'python-data-science-bashlangic',
    'Python ilə Data Science-ə Başlamaq',
    'Data analizinə sıfırdan başlamaq üçün lazım olan biliklər, əsas kitabxanalar (NumPy, Pandas, Matplotlib) və ilk addımlar haqqında ətraflı bələdçi.',
    'Data analizinə sıfırdan başlamaq üçün lazım olan biliklər, kitabxanalar və ilk addımlar.',
    NULL,
    'Rəşad Məmmədov',
    'Data',
    '2026-01-02 10:00:00+00'
  );

-- Yoxlama:
SELECT id, title, author, category, created_at FROM public.posts ORDER BY created_at DESC;