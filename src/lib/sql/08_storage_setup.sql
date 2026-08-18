-- ============================================================
-- 08_storage_setup.sql
-- Supabase Storage: "media" bucket for course/blog images
-- ============================================================
--
-- STEP 1: CREATE THE BUCKET MANUALLY IN SUPABASE DASHBOARD
-- --------------------------------------------------------
-- 1. Go to https://supabase.com and log in
-- 2. Select your project
-- 3. In the left sidebar, click "Storage" (the cloud icon)
-- 4. Click the "New bucket" button
-- 5. Name it exactly: media
-- 6. Set it to PUBLIC (toggle the "Public bucket" switch ON)
-- 7. Click "Create bucket"
--
-- STEP 2: RUN THE SQL BELOW IN THE SQL EDITOR
-- --------------------------------------------------------
-- Open the SQL Editor in the Supabase dashboard and run the
-- statements below to create the storage policies.
-- These policies allow:
--   - Anyone (public) to READ files from the "media" bucket
--   - Authenticated users to UPLOAD/DELETE files
-- ============================================================

-- Policy: Public read access for the "media" bucket
CREATE POLICY "media_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

-- Policy: Authenticated users can upload to the "media" bucket
CREATE POLICY "media_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can update files in the "media" bucket
CREATE POLICY "media_authenticated_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can delete files in the "media" bucket
CREATE POLICY "media_authenticated_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');