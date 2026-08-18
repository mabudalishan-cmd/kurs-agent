-- ============================================================
-- MESSAGES cədvəli
-- Supabase SQL Editor-da işlədin: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1) Cədvəli yarat (artıq varsa əvvəlcə sil)
DROP TABLE IF EXISTS public.messages CASCADE;

CREATE TABLE public.messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  message     text NOT NULL,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2) Row Level Security-i aktivləşdir
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3) Siyasətlər
-- Hamı (anon) yazı göndərə bilər (əlaqə forması üçün)
DROP POLICY IF EXISTS "messages_insert_public" ON public.messages;
CREATE POLICY "messages_insert_public" ON public.messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Yalnız daxil olmuş istifadəçilər (admin) mesajları oxuya bilər
DROP POLICY IF EXISTS "messages_select_authenticated" ON public.messages;
CREATE POLICY "messages_select_authenticated" ON public.messages
  FOR SELECT TO authenticated
  USING (true);

-- Yalnız daxil olmuş istifadəçilər (admin) mesajları yeniləyə bilər (oxunmuş statusu üçün)
DROP POLICY IF EXISTS "messages_update_authenticated" ON public.messages;
CREATE POLICY "messages_update_authenticated" ON public.messages
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Yalnız daxil olmuş istifadəçilər (admin) mesajları silə bilər
DROP POLICY IF EXISTS "messages_delete_authenticated" ON public.messages;
CREATE POLICY "messages_delete_authenticated" ON public.messages
  FOR DELETE TO authenticated
  USING (true);

-- 4) İndekslər
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);
CREATE INDEX idx_messages_is_read ON public.messages (is_read);

-- Yoxlama:
SELECT id, name, email, is_read, created_at FROM public.messages ORDER BY created_at DESC LIMIT 10;