-- ============================================================
-- SUBSCRIBERS cədvəli
-- Supabase SQL Editor-da işlədin: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1) Cədvəli yarat (artıq varsa əvvəlcə sil)
DROP TABLE IF EXISTS public.subscribers CASCADE;

CREATE TABLE public.subscribers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2) Row Level Security-i aktivləşdir
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 3) Siyasətlər
-- Hamı (anon) abunə ola bilər (footer forması üçün)
DROP POLICY IF EXISTS "subscribers_insert_public" ON public.subscribers;
CREATE POLICY "subscribers_insert_public" ON public.subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Yalnız daxil olmuş istifadəçilər (admin) abunələri oxuya bilər
DROP POLICY IF EXISTS "subscribers_select_authenticated" ON public.subscribers;
CREATE POLICY "subscribers_select_authenticated" ON public.subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Yalnız daxil olmuş istifadəçilər (admin) abunələri silə bilər
DROP POLICY IF EXISTS "subscribers_delete_authenticated" ON public.subscribers;
CREATE POLICY "subscribers_delete_authenticated" ON public.subscribers
  FOR DELETE TO authenticated
  USING (true);

-- 4) İndekslər
CREATE INDEX idx_subscribers_created_at ON public.subscribers (created_at DESC);
CREATE INDEX idx_subscribers_email ON public.subscribers (email);

-- Yoxlama:
SELECT id, email, created_at FROM public.subscribers ORDER BY created_at DESC LIMIT 10;