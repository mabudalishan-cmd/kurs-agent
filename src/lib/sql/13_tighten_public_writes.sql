-- ============================================================
-- 13_tighten_public_writes.sql
-- Public yazma icazələrinin sərtləşdirilməsi
-- ============================================================
--
-- Əvvəllər brauzer anon key ilə birbaşa `messages`, `subscribers` və
-- `page_views` cədvəllərinə INSERT edirdi. Bu o demək idi ki, istənilən
-- şəxs anon key-i götürüb cədvəlləri spam-la doldura bilərdi.
--
-- İndi bu yazmalar server route-larından keçir:
--   /api/contact    -> messages
--   /api/subscribe  -> subscribers
--   /api/track      -> page_views
--
-- Həmin route-lar service role key istifadə edir və service role RLS-i
-- tamamilə bypass edir. Ona görə də anon INSERT siyasətlərini silirik.
--
-- Bu faylı Supabase SQL Editor-də icra edin.
-- ============================================================

-- ── messages ────────────────────────────────────────────────
-- Əlaqə formu artıq /api/contact üzərindən yazır.
DROP POLICY IF EXISTS "messages_insert_public" ON public.messages;

-- ── subscribers ─────────────────────────────────────────────
-- Abunəlik forması artıq /api/subscribe üzərindən yazır.
DROP POLICY IF EXISTS "subscribers_insert_public" ON public.subscribers;

-- ── page_views ──────────────────────────────────────────────
-- Analitika artıq /api/track üzərindən yazır.
DROP POLICY IF EXISTS "page_views_public_insert" ON page_views;

-- ============================================================
-- Yoxlama
-- ============================================================
-- Aşağıdakı sorğu qalan siyasətləri göstərir. Nəticədə `anon` rolu üçün
-- INSERT siyasəti OLMAMALIDIR (yalnız SELECT/authenticated siyasətləri).
--
--   SELECT tablename, policyname, roles, cmd
--   FROM pg_policies
--   WHERE tablename IN ('messages', 'subscribers', 'page_views')
--   ORDER BY tablename, cmd;
-- ============================================================
