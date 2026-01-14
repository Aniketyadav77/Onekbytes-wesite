-- SQL script to fix RLS policies for storage.objects
-- Run this in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;

-- Create INSERT policy that handles both path structures:
-- 1. general/{userId}/{filename} - userId is at index [2]
-- 2. job/{userId}/{filename} - userId is at index [2]
CREATE POLICY "Users can upload their own resumes" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'resumes' 
  AND (
    -- For general applications: general/{userId}/{filename}
    ((storage.foldername(name))[1] = 'general' AND (auth.uid())::text = (storage.foldername(name))[2])
    OR
    -- For job applications: job/{userId}/{filename}
    ((storage.foldername(name))[1] = 'job' AND (auth.uid())::text = (storage.foldername(name))[2])
  )
);

-- Create SELECT policy that handles both path structures
CREATE POLICY "Users can view their own resumes" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'resumes' 
  AND (
    -- For general applications: general/{userId}/{filename}
    ((storage.foldername(name))[1] = 'general' AND (auth.uid())::text = (storage.foldername(name))[2])
    OR
    -- For job applications: job/{userId}/{filename}
    ((storage.foldername(name))[1] = 'job' AND (auth.uid())::text = (storage.foldername(name))[2])
  )
);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY cmd, policyname;
