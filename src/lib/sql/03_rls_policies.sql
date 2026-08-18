-- ============================================================
-- 03_rls_policies.sql
-- Row Level Security (RLS) siyasətləri
-- Bu fayl Supabase SQL Editor-də işlədilməlidir
-- ============================================================

-- RLS aktivləşdir (əgər artıq aktiv deyilsə)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COURSES cədvəli üçün siyasətlər
-- ============================================================

-- Hamı oxuya bilər (public səhifələr üçün)
DROP POLICY IF EXISTS "courses_select_public" ON courses;
CREATE POLICY "courses_select_public" ON courses
  FOR SELECT TO anon, authenticated
  USING (true);

-- Yalnız daxil olmuş istifadəçilər yaz/redaktə/silə bilər
DROP POLICY IF EXISTS "courses_insert_authenticated" ON courses;
CREATE POLICY "courses_insert_authenticated" ON courses
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "courses_update_authenticated" ON courses;
CREATE POLICY "courses_update_authenticated" ON courses
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "courses_delete_authenticated" ON courses;
CREATE POLICY "courses_delete_authenticated" ON courses
  FOR DELETE TO authenticated
  USING (true);

-- ============================================================
-- POSTS cədvəli üçün siyasətlər
-- ============================================================

-- Hamı oxuya bilər (public səhifələr üçün)
DROP POLICY IF EXISTS "posts_select_public" ON posts;
CREATE POLICY "posts_select_public" ON posts
  FOR SELECT TO anon, authenticated
  USING (true);

-- Yalnız daxil olmuş istifadəçilər yaz/redaktə/silə bilər
DROP POLICY IF EXISTS "posts_insert_authenticated" ON posts;
CREATE POLICY "posts_insert_authenticated" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update_authenticated" ON posts;
CREATE POLICY "posts_update_authenticated" ON posts
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "posts_delete_authenticated" ON posts;
CREATE POLICY "posts_delete_authenticated" ON posts
  FOR DELETE TO authenticated
  USING (true);

-- ============================================================
-- Qeyd: Əgər daha ciddi təhlükəsizlik istəyirsinizsə,
-- authenticated əvəzinə xüsusi admin rol yoxlayıcısı istifadə edə bilərsiniz.
-- Məsələn, yalnız müəyyən email-lərə icazə vermək:
--
-- CREATE POLICY "courses_insert_admin" ON courses
--   FOR INSERT TO authenticated
--   WITH CHECK (
--     auth.jwt() ->> 'email' = 'admin@example.com'
--   );
-- ============================================================