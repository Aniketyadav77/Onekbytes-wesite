import { useState, useEffect, useCallback } from 'react'
import { JobService, JobApplicationService, GeneralApplicationService } from '@/lib/enhanced-careers-service'
import { Job, JobApplication, GeneralApplication } from '@/types/database'

// Enhanced useCareers hook with full CRUD operations and caching
let jobsCache: Job[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

export const useCareers = () => {
  const [jobs, setJobs] = useState<Job[]>([]) // Start with empty array
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [generalApplications, setGeneralApplications] = useState<GeneralApplication[]>([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  // Fetch jobs with loading state and caching
  const fetchJobs = useCallback(async (includeInactive = true, forceRefresh = false) => {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && jobsCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      setJobs(jobsCache);
      setLoading(false);
      return;
    }

    setLoading(true)
    setError(null)
    try {
      const jobsData = await JobService.getAllJobs(includeInactive)
      setJobs(jobsData)
      // Update cache
      jobsCache = jobsData;
      cacheTimestamp = now;
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
      console.error('Error fetching jobs:', err)
      setError(errorMessage)
      // Set empty array on error instead of fallback
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch job applications
  const fetchJobApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const applicationsData = await JobApplicationService.getAllJobApplications()
      setJobApplications(applicationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job applications')
      console.error('Error fetching job applications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch general applications
  const fetchGeneralApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const applicationsData = await GeneralApplicationService.getAllGeneralApplications()
      setGeneralApplications(applicationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch general applications')
      console.error('Error fetching general applications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create job
  const createJob = useCallback(async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    setError(null)
    try {
      const newJob = await JobService.createJob(jobData)
      setJobs(prev => [newJob, ...prev])
      return newJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update job
  const updateJob = useCallback(async (id: string, jobData: Partial<Job>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedJob = await JobService.updateJob(id, jobData)
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete job
  const deleteJob = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await JobService.deleteJob(id)
      setJobs(prev => prev.filter(job => job.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update job status
  const updateJobStatus = useCallback(async (id: string, status: string) => {
    setError(null)
    try {
      const updatedJob = await JobService.updateJobStatus(id, status)
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job status')
      throw err
    }
  }, [])

  // Bulk operations
  const bulkUpdateStatus = useCallback(async (jobIds: string[], status: Job['status']) => {
    setLoading(true)
    setError(null)
    try {
      await JobService.bulkUpdateStatus(jobIds, status as string)
      setJobs(prev => prev.map(job => 
        jobIds.includes(job.id) ? { ...job, status, updated_at: new Date().toISOString() } : job
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update jobs')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkDelete = useCallback(async (jobIds: string[]) => {
    setLoading(true)
    setError(null)
    try {
      await JobService.bulkDelete(jobIds)
      setJobs(prev => prev.filter(job => !jobIds.includes(job.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete jobs')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Search jobs
  const searchJobs = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const searchResults = await JobService.searchJobs(query)
      return searchResults
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Filter jobs by department
  const filterJobsByDepartment = useCallback(async (department: string) => {
    setLoading(true)
    setError(null)
    try {
      const filteredJobs = await JobService.getJobsByDepartment(department)
      return filteredJobs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter jobs')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get application count for a job
  const getApplicationCount = useCallback(async (jobId: string) => {
    try {
      return await JobService.getApplicationCount(jobId)
    } catch (err) {
      console.error('Error getting application count:', err)
      return 0
    }
  }, [])

  // Real-time updates
  useEffect(() => {
    const subscription = JobService.subscribeToJobChanges((payload) => {
      console.log('Real-time job change:', payload)
      // Refresh jobs on any change
      fetchJobs()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchJobs])

  // Initial fetch
  useEffect(() => {
    fetchJobs()
    fetchJobApplications()
    fetchGeneralApplications()
  }, [fetchJobs, fetchJobApplications, fetchGeneralApplications])

  return {
    jobs,
    jobApplications,
    generalApplications,
    loading,
    error,
    fetchJobs,
    fetchJobApplications,
    fetchGeneralApplications,
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    bulkUpdateStatus,
    bulkDelete,
    searchJobs,
    filterJobsByDepartment,
    getApplicationCount,
    clearError: () => setError(null)
  }
}

// Hook specifically for admin operations
export const useAdminCareers = () => {
  const careersHook = useCareers()
  
  // Additional admin-specific functionality
  const getJobsWithApplicationCounts = useCallback(async () => {
    try {
      return await JobService.getJobsWithApplicationCounts()
    } catch (err) {
      console.error('Error getting jobs with application counts:', err)
      throw err
    }
  }, [])

  return {
    ...careersHook,
    getJobsWithApplicationCounts
  }
}

export default useCareers
