-- ============================================================
-- 11_email_campaigns.sql
-- Email campaigns table for marketing emails
-- ============================================================
--
-- Run this in the Supabase SQL Editor to create the email_campaigns table.
-- ============================================================

-- Create the email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  image_url TEXT
);

-- Index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns (status);

-- Index for faster date sorting
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns (created_at);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users (admins) can SELECT campaigns
CREATE POLICY "email_campaigns_authenticated_select"
ON email_campaigns
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users (admins) can INSERT campaigns
CREATE POLICY "email_campaigns_authenticated_insert"
ON email_campaigns
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users (admins) can UPDATE campaigns
CREATE POLICY "email_campaigns_authenticated_update"
ON email_campaigns
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users (admins) can DELETE campaigns
CREATE POLICY "email_campaigns_authenticated_delete"
ON email_campaigns
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Migration: Add image_url column (for existing databases)
-- ============================================================
-- Run this if the table already exists without the image_url column
ALTER TABLE email_campaigns ADD COLUMN IF NOT EXISTS image_url TEXT;
