import { supabase } from '@/lib/supabase'
import { Job, JobApplication, GeneralApplication } from '@/types/database'

// Enhanced Job Service with full CRUD operations
export class JobService {
  // Get all jobs with optional filters - optimized for speed
  static async getAllJobs(includeInactive = false): Promise<Job[]> {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!includeInactive) {
        query = query.eq('status', 'active')
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  }

  // Get a specific job by ID
  static async getJobById(id: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching job:', error)
      throw error
    }
  }

  // Create a new job
  static async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> {
    try {
      // Check for duplicate job titles
      const { data: existingJob, error: checkError } = await supabase
        .from('jobs')
        .select('id')
        .eq('job_title', jobData.job_title)
        .maybeSingle()

      // If there's an error other than "no rows returned", throw it
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingJob) {
        throw new Error('A job with this title already exists')
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          status: jobData.status || 'active'
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', error)
        throw new Error(`Failed to create job: ${error.message}`)
      }
      
      if (!data) {
        throw new Error('No data returned from job creation')
      }
      
      return data
    } catch (error) {
      console.error('Error creating job:', error)
      throw error
    }
  }

  // Update a job
  static async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      // If updating job_title, check for duplicates
      if (jobData.job_title) {
        const { data: existingJob, error: checkError } = await supabase
          .from('jobs')
          .select('id')
          .eq('job_title', jobData.job_title)
          .neq('id', id)
          .maybeSingle()

        // If there's an error other than "no rows returned", throw it
        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (existingJob) {
          throw new Error('A job with this title already exists')
        }
      }

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', error)
        throw new Error(`Failed to update job: ${error.message}`)
      }
      
      if (!data) {
        throw new Error('No data returned from job update')
      }
      
      return data
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  }

  // Delete a job (permanent)
  static async deleteJob(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  // Update job status
  static async updateJobStatus(id: string, status: string): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating job status:', error)
      throw error
    }
  }

  // Bulk operations
  static async bulkUpdateStatus(jobIds: string[], status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .in('id', jobIds)

      if (error) throw error
    } catch (error) {
      console.error('Error bulk updating job status:', error)
      throw error
    }
  }

  static async bulkDelete(jobIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .in('id', jobIds)

      if (error) throw error
    } catch (error) {
      console.error('Error bulk deleting jobs:', error)
      throw error
    }
  }

  // Get application count for a job
  static async getApplicationCount(jobId: string): Promise<number> {
    try {
      // Validate jobId parameter
      if (!jobId || typeof jobId !== 'string') {
        console.warn('[JobService] Invalid jobId provided to getApplicationCount')
        return 0
      }

      // Use count query with head: true for optimal performance
      const { count, error } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', jobId)

      if (error) {
        // Log error details in a production-safe way
        console.warn('[JobService] Could not fetch application count:', {
          jobId,
          code: error.code,
          message: error.message
        })

        // Gracefully handle missing table or permission errors
        if (error.code === 'PGRST106' || error.code === '42P01' || error.message?.includes('does not exist')) {
          return 0
        }
        
        // Return 0 for other errors to prevent blocking
        return 0
      }
      
      // Ensure we always return a number, not null or undefined
      return typeof count === 'number' ? count : 0
    } catch (error) {
      // Handle unexpected errors gracefully
      console.warn('[JobService] Exception in getApplicationCount:', {
        jobId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return 0
    }
  }

  // Real-time subscription for job changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static subscribeToJobChanges(callback: (payload: any) => void) {
    return supabase
      .channel('jobs-changes')
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        callback
      )
      .subscribe()
  }

  // Get jobs with application counts
  static async getJobsWithApplicationCounts(): Promise<(Job & { applicationCount: number })[]> {
    try {
      const jobs = await this.getAllJobs(true)
      
      // Fetch application counts in parallel with individual error handling
      const jobsWithCounts = await Promise.all(
        jobs.map(async (job) => {
          try {
            const applicationCount = await this.getApplicationCount(job.id)
            return { ...job, applicationCount }
          } catch (error) {
            // If individual count fails, return 0 and continue
            void error
            console.warn('[JobService] Failed to get count for job:', job.id)
            return { ...job, applicationCount: 0 }
          }
        })
      )
      
      return jobsWithCounts
    } catch (error) {
      console.error('[JobService] Error getting jobs with application counts:', 
        error instanceof Error ? error.message : 'Unknown error'
      )
      throw error
    }
  }

  // Search jobs by title or department
  static async searchJobs(query: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .or(`job_title.ilike.%${query}%,department.ilike.%${query}%`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching jobs:', error)
      throw error
    }
  }

  // Filter jobs by department
  static async getJobsByDepartment(department: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('department', department)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error filtering jobs by department:', error)
      throw error
    }
  }
}

// Job Application Service
export class JobApplicationService {
  // Get all job applications
  static async getAllJobApplications(): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            job_title,
            department
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching job applications:', error)
      throw error
    }
  }

  // Create new job application
  static async createJobApplication(applicationData: Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{
          ...applicationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating job application:', error)
      throw error
    }
  }

  // Update job application status
  static async updateApplicationStatus(id: string, status: string): Promise<JobApplication> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  }

  // Get applications for a specific job
  static async getApplicationsForJob(jobId: string): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching applications for job:', error)
      throw error
    }
  }
}

// General Application Service
export class GeneralApplicationService {
  // Get all general applications
  static async getAllGeneralApplications(): Promise<GeneralApplication[]> {
    try {
      const { data, error } = await supabase
        .from('general_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching general applications:', error)
      throw error
    }
  }

  // Create new general application
  static async createGeneralApplication(applicationData: Omit<GeneralApplication, 'id' | 'created_at' | 'updated_at'>): Promise<GeneralApplication> {
    try {
      const { data, error } = await supabase
        .from('general_applications')
        .insert([{
          ...applicationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating general application:', error)
      throw error
    }
  }

  // Update general application status
  static async updateGeneralApplicationStatus(id: string, status: string): Promise<GeneralApplication> {
    try {
      const { data, error } = await supabase
        .from('general_applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating general application status:', error)
      throw error
    }
  }
}

// File Upload Service
export class FileUploadService {
  // Upload resume file
  static async uploadResume(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('applications')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('applications')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading resume:', error)
      throw error
    }
  }

  // Delete file
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('applications')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }
}
