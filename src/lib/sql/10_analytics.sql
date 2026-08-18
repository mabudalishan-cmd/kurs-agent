-- ============================================================
-- 10_analytics.sql
-- Page views tracking table for analytics
-- ============================================================
--
-- Run this in the Supabase SQL Editor to create the page_views table.
-- ============================================================

-- Create the page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at);

-- Index for faster page_path grouping
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views (page_path);

-- Index for faster unique visitor counting
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views (visitor_id);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Public can INSERT page views (site logs views anonymously)
CREATE POLICY "page_views_public_insert"
ON page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated users (admins) can SELECT page views
CREATE POLICY "page_views_authenticated_select"
ON page_views
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users (admins) can DELETE page views
CREATE POLICY "page_views_authenticated_delete"
ON page_views
FOR DELETE
TO authenticated
USING (true);