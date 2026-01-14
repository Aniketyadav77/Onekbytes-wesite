// Database table types based on Supabase schema

export interface Job {
  id: string;
  job_title: string;
  department: string;
  location: string;
  salary_range?: string;
  experience_level: string;
  job_type: string;
  short_description: string;
  full_description: string;
  requirements: string;
  responsibilities: string;
  status?: 'active' | 'inactive' | 'draft' | 'expired';
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  full_name?: string;
  role?: 'user' | 'admin';
  company?: string;
  location?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  linkedin_profile?: string;
  resume_url: string;
  cover_letter?: string;
  application_source?: 'job_posting' | 'general_form' | 'referral';
  status?: 'pending' | 'reviewing' | 'hired' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface GeneralApplication {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter?: string;
  application_source?: 'job_posting' | 'general_form' | 'referral';
  status?: 'pending' | 'reviewing' | 'hired' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationNote {
  id: string;
  application_id: string;
  application_type: 'job_application' | 'general_application';
  reviewer_id?: string;
  reviewer_name: string;
  note_type?: 'general' | 'interview_feedback' | 'hr_review' | 'technical_review' | 'final_decision';
  content: string;
  rating?: number; // 1-5
  is_internal?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InterviewSchedule {
  id: string;
  application_id?: string;
  application_type: 'job_application' | 'general_application';
  interviewer_name: string;
  interviewer_email: string;
  applicant_name: string;
  applicant_email: string;
  interview_date: string;
  interview_time: string;
  interview_type?: 'video_call' | 'phone_call' | 'in_person';
  meeting_link?: string;
  meeting_location?: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  duration_minutes?: number;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'application_received' | 'application_approved' | 'application_rejected' | 'interview_scheduled' | 'reminder';
  subject: string;
  body: string;
  variables?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  likes_count?: number;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PostLike {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface ContactUs {
  id: string;
  name: string;
  email: string;
  message: string;
  user_id: string;
  created_at: string;
}
