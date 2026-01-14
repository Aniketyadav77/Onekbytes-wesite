import { supabase } from '@/lib/supabase';
import { Job, JobApplication, GeneralApplication } from '@/types/database';

export class JobService {
  // Get all active jobs
  static async getAllJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllJobs:', error);
      throw error;
    }
  }

  // Get a specific job by ID
  static async getJobById(id: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getJobById:', error);
      throw error;
    }
  }

  // Create new job (admin only)
  static async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createJob:', error);
      throw error;
    }
  }

  // Update job (admin only)
  static async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateJob:', error);
      throw error;
    }
  }

  // Delete job (admin only) - soft delete by setting status to inactive
  static async deleteJob(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) {
        console.error('Error deleting job:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteJob:', error);
      throw error;
    }
  }

  // Submit job application
  static async submitJobApplication(applicationData: Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting job application:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in submitJobApplication:', error);
      throw error;
    }
  }

  // Submit general application
  static async submitGeneralApplication(applicationData: Omit<GeneralApplication, 'id' | 'created_at' | 'updated_at'>): Promise<GeneralApplication> {
    try {
      const { data, error } = await supabase
        .from('general_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting general application:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in submitGeneralApplication:', error);
      throw error;
    }
  }

  // Get all applications (admin only)
  static async getAllApplications(): Promise<{
    jobApplications: (JobApplication & { jobs: Pick<Job, 'job_title' | 'department' | 'location'> })[];
    generalApplications: GeneralApplication[];
  }> {
    try {
      // Get job applications with job details
      const { data: jobApplications, error: jobAppError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (
            job_title,
            department,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (jobAppError) {
        console.error('Error fetching job applications:', jobAppError);
        throw jobAppError;
      }

      // Get general applications
      const { data: generalApplications, error: generalAppError } = await supabase
        .from('general_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (generalAppError) {
        console.error('Error fetching general applications:', generalAppError);
        throw generalAppError;
      }

      return {
        jobApplications: jobApplications || [],
        generalApplications: generalApplications || []
      };
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      throw error;
    }
  }

  // Update application status (admin only)
  static async updateJobApplicationStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating job application status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateJobApplicationStatus:', error);
      throw error;
    }
  }

  // Update general application status (admin only)
  static async updateGeneralApplicationStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('general_applications')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating general application status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateGeneralApplicationStatus:', error);
      throw error;
    }
  }
}
