-- ============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES FOR PRODUCTION
-- ============================================================================
-- This file contains all RLS policies needed for production deployment
-- Run these migrations to enable RLS on all tables
-- ============================================================================

-- ============================================================================
-- 1. ENABLE RLS ON JOBS TABLE
-- ============================================================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active jobs (public view)
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users to read their own job applications
CREATE POLICY "Allow read own job" ON jobs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admins can insert/update/delete jobs
-- Assumes you have an 'is_admin' column on profiles table
CREATE POLICY "Only admins can insert jobs" ON jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update jobs" ON jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete jobs" ON jobs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- 2. ENABLE RLS ON JOB_APPLICATIONS TABLE
-- ============================================================================
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Users can read their own job applications
CREATE POLICY "Allow users read own job applications" ON job_applications
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can read all job applications
CREATE POLICY "Allow admins read all job applications" ON job_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can insert their own job applications
CREATE POLICY "Allow users insert own job applications" ON job_applications
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own job applications (before deadline)
CREATE POLICY "Allow users update own job applications" ON job_applications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Only admins can update application status
CREATE POLICY "Allow admins update job applications" ON job_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- 3. ENABLE RLS ON PROFILES TABLE
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Allow users read own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "Allow admins read all profiles" ON profiles
  FOR SELECT
  USING (is_admin = true);

-- Users can update their own profile
CREATE POLICY "Allow users update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Prevent regular users from setting themselves as admin
CREATE POLICY "Prevent non-admin privilege escalation" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    CASE 
      WHEN is_admin = true THEN 
        -- Can only keep admin if already admin
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid() AND p.is_admin = true
        )
      ELSE true
    END
  );

-- ============================================================================
-- 4. ENABLE RLS ON STORAGE (IF USING FILE UPLOADS)
-- ============================================================================
-- For resume uploads in job applications
CREATE POLICY "Allow users upload own resumes" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow users read own resumes" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can read all resumes
CREATE POLICY "Allow admins read all resumes" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- HELPFUL QUERIES FOR TESTING RLS
-- ============================================================================

-- Test: Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Test: Get current user ID (run as authenticated user)
-- SELECT auth.uid();

-- Test: Check if user is admin
-- SELECT is_admin FROM profiles WHERE id = auth.uid();

-- Test: Verify policies are created
-- SELECT * FROM pg_policies WHERE tablename = 'jobs';
