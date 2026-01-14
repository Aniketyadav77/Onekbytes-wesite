-- Fix RLS policies for job_applications to allow admin count queries
-- This fixes the 400 errors when admins try to get application counts

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can create job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can manage job applications" ON public.job_applications;

-- Create new policies

-- Allow users to view their own job applications
CREATE POLICY "Users can view their own job applications" ON public.job_applications
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create job applications
CREATE POLICY "Users can create job applications" ON public.job_applications
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all job applications (including count queries)
CREATE POLICY "Admins can view all job applications" ON public.job_applications
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update and delete job applications
CREATE POLICY "Admins can manage job applications" ON public.job_applications
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Verify RLS is enabled
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
