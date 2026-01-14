import { useState, useEffect } from 'react';
import { JobService } from '@/lib/careers-service';
import { Job, JobApplication, GeneralApplication } from '@/types/database';

// Hook for fetching all jobs
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await JobService.getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const refetch = async () => {
    try {
      setError(null);
      const data = await JobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error('Error refetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to refetch jobs');
    }
  };

  return { jobs, loading, error, refetch };
}

// Hook for fetching a single job
export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await JobService.getJobById(id);
        setJob(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return { job, loading, error };
}

// Hook for job applications
export function useJobApplication() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (applicationData: Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await JobService.submitJobApplication(applicationData);
      return result;
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitApplication, submitting, error };
}

// Hook for general applications
export function useGeneralApplication() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (applicationData: Omit<GeneralApplication, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await JobService.submitGeneralApplication(applicationData);
      return result;
    } catch (err) {
      console.error('Error submitting general application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitApplication, submitting, error };
}

// Hook for admin functionality
export function useAdminCareers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await JobService.createJob(jobData);
      return result;
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await JobService.updateJob(id, jobData);
      return result;
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await JobService.deleteJob(id);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllApplications = async () => {
    try {
      setError(null);
      const result = await JobService.getAllApplications();
      return result;
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      throw err;
    }
  };

  const updateJobApplicationStatus = async (id: string, status: string) => {
    try {
      setError(null);
      await JobService.updateJobApplicationStatus(id, status);
    } catch (err) {
      console.error('Error updating job application status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      throw err;
    }
  };

  const updateGeneralApplicationStatus = async (id: string, status: string) => {
    try {
      setError(null);
      await JobService.updateGeneralApplicationStatus(id, status);
    } catch (err) {
      console.error('Error updating general application status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      throw err;
    }
  };

  return {
    createJob,
    updateJob,
    deleteJob,
    getAllApplications,
    updateJobApplicationStatus,
    updateGeneralApplicationStatus,
    loading,
    error
  };
}
