-- Complete database setup for Onekbyte frontend application
-- Run this script in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT,
  experience_level TEXT NOT NULL,
  job_type TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_profile TEXT,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  application_source TEXT DEFAULT 'job_posting' CHECK (application_source IN ('job_posting', 'general_form', 'referral')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'hired', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create general_applications table
CREATE TABLE IF NOT EXISTS public.general_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_profile TEXT,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  application_source TEXT DEFAULT 'general_form' CHECK (application_source IN ('general_form', 'referral')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'hired', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Update profiles table with correct schema
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Set up Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
  DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;
  
  -- Create new policies
  CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
    FOR SELECT USING (true);

  CREATE POLICY "Admins can manage jobs" ON public.jobs
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating job policies: %', SQLERRM;
END $$;

-- Create policies for job_applications table
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own job applications" ON public.job_applications;
  DROP POLICY IF EXISTS "Users can create job applications" ON public.job_applications;
  DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
  
  -- Create new policies
  CREATE POLICY "Users can view their own job applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can create job applications" ON public.job_applications
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admins can view all job applications" ON public.job_applications
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating job application policies: %', SQLERRM;
END $$;

-- Create policies for general_applications table
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own general applications" ON public.general_applications;
  DROP POLICY IF EXISTS "Users can create general applications" ON public.general_applications;
  DROP POLICY IF EXISTS "Admins can view all general applications" ON public.general_applications;
  
  -- Create new policies
  CREATE POLICY "Users can view their own general applications" ON public.general_applications
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can create general applications" ON public.general_applications
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admins can view all general applications" ON public.general_applications
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating general application policies: %', SQLERRM;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS on_jobs_updated ON public.jobs;
CREATE TRIGGER on_jobs_updated
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_job_applications_updated ON public.job_applications;
CREATE TRIGGER on_job_applications_updated
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_general_applications_updated ON public.general_applications;
CREATE TRIGGER on_general_applications_updated
  BEFORE UPDATE ON public.general_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample jobs for testing
INSERT INTO public.jobs (job_title, department, location, salary_range, experience_level, job_type, short_description, full_description, requirements, responsibilities, status) VALUES
('Senior Software Engineer', 'Engineering', 'Remote', '$120k - $160k', 'Senior', 'Full-time', 'Join our team to build cutting-edge AI applications', 'We are looking for an experienced software engineer to help build our next-generation AI platform. You will work with modern technologies and collaborate with a talented team.', 'Bachelor''s degree in Computer Science or related field, 5+ years of experience with React, Node.js, and cloud platforms', 'Develop and maintain web applications, collaborate with cross-functional teams, mentor junior developers', 'active'),
('Product Manager', 'Product', 'San Francisco, CA', '$100k - $140k', 'Mid-level', 'Full-time', 'Lead product strategy for our AI platform', 'Drive product vision and strategy for our AI platform. Work closely with engineering, design, and business teams to deliver exceptional user experiences.', 'MBA or equivalent experience, 3+ years in product management, experience with AI/ML products preferred', 'Define product roadmap, conduct market research, work with engineering teams', 'active'),
('Data Scientist', 'Data Science', 'New York, NY', '$110k - $150k', 'Mid-level', 'Full-time', 'Analyze data to drive business insights', 'Use advanced analytics and machine learning to extract insights from large datasets and drive business decisions.', 'PhD or Master''s in Data Science, Statistics, or related field, proficiency in Python, R, SQL', 'Build predictive models, analyze complex datasets, present findings to stakeholders', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON public.jobs(department);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_general_applications_user_id ON public.general_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_general_applications_status ON public.general_applications(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
