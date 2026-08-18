-- ============================================================
-- 12_students_payments.sql
-- Student management with groups and monthly payment tracking
-- ============================================================

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups (created_at);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  course_id TEXT,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_status ON students (status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students (created_at);

-- Create student_payments table
CREATE TABLE IF NOT EXISTS student_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  UNIQUE(student_id, year, month)
);

CREATE INDEX IF NOT EXISTS idx_student_payments_student_id ON student_payments (student_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_year_month ON student_payments (year, month);


-- ============================================================
-- RLS Policies for groups
-- ============================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "groups_authenticated_select"
ON groups FOR SELECT TO authenticated USING (true);

CREATE POLICY "groups_authenticated_insert"
ON groups FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "groups_authenticated_update"
ON groups FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "groups_authenticated_delete"
ON groups FOR DELETE TO authenticated USING (true);

-- ============================================================
-- RLS Policies for students
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_authenticated_select"
ON students FOR SELECT TO authenticated USING (true);

CREATE POLICY "students_authenticated_insert"
ON students FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "students_authenticated_update"
ON students FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "students_authenticated_delete"
ON students FOR DELETE TO authenticated USING (true);

-- ============================================================
-- RLS Policies for student_payments
-- ============================================================
ALTER TABLE student_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_payments_authenticated_select"
ON student_payments FOR SELECT TO authenticated USING (true);

CREATE POLICY "student_payments_authenticated_insert"
ON student_payments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "student_payments_authenticated_update"
ON student_payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "student_payments_authenticated_delete"
ON student_payments FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Migration: Add group_id column (for existing databases)
-- ============================================================
ALTER TABLE students ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE SET NULL;
